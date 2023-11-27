const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, User, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require("sequelize");

const router = express.Router();

const validateBookings = [
    check('startDate')
        .exists({ checkFalsy: true })
        // .isDate()
        .withMessage("Start Date must be a provided date"),
    check('endDate')
        .exists({ checkFalsy: true })
        // .isDate()
        .withMessage("End Date must be a provided date"),
    handleValidationErrors
]

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id

    const bookings = await Booking.findAll({
        where: {
            userId
        }
    })
    let spotIds = []
    for (let booking of bookings) {
        if (spotIds.indexOf(booking.spotId) === -1) spotIds.push(booking.spotId)
    }
    const spots = await Spot.findAll({
        include: [
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            }],
        attributes: {
            exclude: ['description', 'createdAt', 'updatedAt']
        },
        where: {
            id: spotIds
        }
    })

    let spotArr = []
    for (let spot of spots) {
        spot = await spot.toJSON()
        for (let image of spot.SpotImages) {
            if (image.preview) {
                spot.previewImage = image.url
                break
            }
        }
        delete spot.SpotImages
        spotArr.push(spot)
    }

    let result = []
    for (let booking of bookings) {
        booking = await booking.toJSON()
        for (let spot of spotArr) {
            if (booking.spotId === spot.id) {
                booking.Spot = spot
                break
            }
        }
        result.push(booking)
    }

    res.json({ "Bookings": result })
})

router.put('/:id', requireAuth, validateBookings, async (req, res, next) => {
    let booking = await Booking.findByPk(req.params.id)
    if (!booking) {
        res.statusCode = 404
        return res.json({ 'message': "Booking couldn't be found" })
    }
    const update = req.body

    if (req.user.id !== booking.userId) {
        res.statusCode = 403
        return res.json({ 'message': 'Forbidden' })
    }

    const now = new Date()

    if (booking.startDate < now) {
        res.statusCode = 403
        res.json({ "message": "Past bookings can't be modified" })
    }

    booking.startDate = update.startDate
    booking.endDate = update.endDate
    booking.updatedAt = now

    const startTime = new Date(booking.startDate).getTime()
    const endTime = new Date(booking.endDate).getTime()

    if (startTime >= endTime) {
        const err = new Error('Bad Request');
        err.status = 400;
        err.errors = { 'endDate': "End Date cannot be on or before Start Date" };
        return next(err);
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            id: {
                [Op.notIn]: [booking.id]
            }
        }
    })
    const errors = {}
    for (const existingBooking of bookings) {
        const existingStart = new Date(existingBooking.startDate).getTime()
        const existingEnd = new Date(existingBooking.endDate).getTime()

        if (startTime >= existingStart && startTime <= existingEnd) {
            errors.startDate = "Start Date conflicts with an existing booking"
        }
        if (endTime >= existingStart && endTime <= existingEnd) {
            errors.endDate = "End Date conflicts with an existing booking"
        }
        if (startTime < existingStart && endTime > existingEnd) {
            errors.startDate = "Start Date conflicts with an existing booking"
            errors.endDate = "End Date conflicts with an existing booking"
        }
    }
    if (errors.startDate || errors.endDate) {
        const err = new Error("Sorry, this spot is already booked for the specified dates")
        err.status = 403
        err.errors = errors
        return next(err)
    }

    try {
        await booking.validate()
        await booking.save()
        res.json(booking)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    const userId = req.user.id
    const booking = await Booking.findByPk(req.params.id, {
    })
    if (!booking) {
        res.statusCode = 404
        return res.json({ "message": "Booking couldn't be found" })
    }


    const spot = await Spot.findByPk(booking.spotId)
    let bookingStart = new Date(booking.startDate).getTime()

    const now = new Date().getTime()

    if (bookingStart < now) {
        res.statusCode = 403
        return res.json({ "message": "Bookings that have been started can't be deleted" })
    }

    if (booking.userId === userId || spot.ownerId === userId) {
        await booking.destroy()
        res.json({ 'message': "Successfully deleted" })
    } else {
        res.statusCode = 403
        res.json({ "message": "Forbidden" })
    }
    res.json()
})

module.exports = router;