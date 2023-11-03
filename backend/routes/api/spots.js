const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Op } = require("sequelize");

const validateSpots = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Name is required"),
    check('name')
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Price per day is required"),
    check('price')
        .isFloat({ min: 0 })
        .withMessage("Price must be greater than or equal to 0"),
    handleValidationErrors
]

const validateReviews = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Stars is required"),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

const validateBookings = [
    check('startDate')
        .exists({ checkFalsy: true })
        // .isDate()
        .withMessage("Start date must be a provided date"),
    check('endDate')
        .exists({ checkFalsy: true })
        // .isDate()
        .withMessage("End date must be a provided date"),
    handleValidationErrors
]

router.post('/:id/images', requireAuth, async (req, res) => {
    const ownerId = req.user.id

    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    if (ownerId !== spot.ownerId) {
        res.statusCode = 403
        return res.json({ 'message': 'Forbidden' })
    }
    const body = req.body
    try {
        const image = await spot.createSpotImage(body)
        const responseData = {}
        responseData.id = image.id
        responseData.url = image.url
        responseData.preview = image.preview
        res.json(responseData)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})

router.post('/:id/reviews', requireAuth, validateReviews, async (req, res) => {
    const userId = req.user.id

    const spot = await Spot.findByPk(req.params.id, {
        include: [Review]
    })
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    for (existingReview of spot.Reviews) {
        if (existingReview.userId === userId) {
            res.statusCode = 500
            return res.json({ 'message': "User already has a review for this spot" })
        }
    }
    const body = req.body
    body.userId = userId
    try {
        const review = await spot.createReview(body)
        res.json(review)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})

router.post('/:id/bookings', requireAuth, validateBookings, async (req, res, next) => {
    const userId = req.user.id

    const spot = await Spot.findByPk(req.params.id)
    const body = req.body
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    if (spot.ownerId === userId) {
        res.statusCode = 403
        return res.json({ 'message': 'Forbidden' })
    }
    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        }
    })
    let startTime = new Date(body.startDate).getTime()
    let endTime = new Date(body.endDate).getTime()
    // check for date conflicts
    if (startTime >= endTime) {
        const err = new Error('Bad Request');
        err.status = 400;
        err.errors = { 'endDate': "endDate cannot be on or before startDate" };
        return next(err);
    }
    const errors = {}
    for (const existingBooking of bookings) {
        const existingStart = new Date(existingBooking.startDate).getTime()
        const existingEnd = new Date(existingBooking.endDate).getTime()

        if (startTime >= existingStart && startTime <= existingEnd) {
            errors.startDate = "Start date conflicts with an existing booking"
        }
        if (endTime >= existingStart && endTime <= existingEnd) {
            errors.endDate = "End date conflicts with an existing booking"
        }
        if (startTime < existingStart && endTime > existingEnd) {
            errors.startDate = "Start date conflicts with an existing booking"
            errors.endDate = "End date conflicts with an existing booking"
        }
    }
    if (errors.startDate || errors.endDate) {
        const err = new Error("Sorry, this spot is already booked for the specified dates")
        err.status = 403
        err.errors = errors
        return next(err)
    }
    body.userId = userId
    body.spotId = spot.id
    try {
        const booking = await Booking.create(body, { validate: true })
        res.json(booking)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})

router.get('/:id/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }

    // query for all reviews with specified attributes + User + ReviewImages
    const reviews = await Review.findAll({
        where: {
            spotId: req.params.id
        },
        attributes: ['id', 'spotId', 'userId', 'review', 'stars', 'createdAt', 'updatedAt'],
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: ReviewImage,
            attributes: ['id', 'url']
        }]
    })

    return res.json({ "Reviews": reviews })
})

router.get('/:id/bookings', requireAuth, async (req, res) => {

    // find spot
    const spot = await Spot.findByPk(req.params.id)
    // confirm spot exists
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    let owner = false
    if (req.user.id === spot.ownerId) owner = true

    // find all bookings with spotId matching the spot's id, with more attributes if user is the owner
    let bookingAttributes = []
    if (!owner) { bookingAttributes = ['id', 'userId', 'createdAt', 'updatedAt'] }
    console.log(bookingAttributes)
    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        },
        attributes: {
            exclude: bookingAttributes
        }
    })
    console.log(bookings)
    let userIdArray = []
    for (let booking of bookings) {
        if (userIdArray.indexOf(booking.userId) === -1) userIdArray.push(booking.userId)
    }
    // if spot owner, query for all owners whose ids appear in bookings
    let users
    if (owner) {
        users = await User.findAll({
            where: {
                id: {
                    [Op.in]: userIdArray
                }
            },
            attributes: ['id', 'firstName', 'lastName']
        })
    }
    // if owner, add owner details to each booking where ownerId matches owner's id
    let result = []
    if (owner) {
        for (let booking of bookings) {
            booking = await booking.toJSON()

            for (let user of users) {
                if (booking.userId === user.id) booking.User = user
            }

            result.push(booking)
        }
        return res.json({ "Bookings": result })

    }
    res.json({ "Bookings": bookings })
})

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const spots = await Spot.findAll({
        where: {
            ownerId: userId
        },
        include: [{
            model: Review,
            attributes: ['stars']
        },
        {
            model: SpotImage,
            attributes: ['url', 'preview']
        }]
    })
    let result = []
    for (let spot of spots) {
        spot = await spot.toJSON()
        let imageURL
        for (let spotImage of spot.SpotImages) {
            if (spotImage.preview) imageURL = spotImage.url
            break
        }
        let reviewCount = spot.Reviews.length
        let reviewSum = 0
        for (let review of spot.Reviews) {
            reviewSum += review.stars
        }
        delete spot.Reviews
        delete spot.SpotImages
        spot.avgRating = reviewSum / reviewCount
        spot.previewImage = imageURL
        result.push(spot)
    }

    res.json({ "Spots": result })
})

router.delete('/:id', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    if (req.user.id === spot.ownerId) {
        await spot.destroy()
        res.json({ 'message': 'Successfully deleted' })
    } else {
        res.statusCode = 403
        return res.json({ 'message': 'Forbidden' })
    }
})

router.put('/:id', requireAuth, validateSpots, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    const update = req.body

    if (req.user.id === spot.ownerId) {
        let now = new Date()
        spot.address = update.address
        spot.city = update.city
        spot.state = update.state
        spot.country = update.country
        spot.lat = update.lat
        spot.lng = update.lng
        spot.name = update.name
        spot.description = update.description
        spot.price = update.price
        spot.updatedAt = now
        try {
            await spot.validate()
            await spot.save()
            res.json(spot)
        } catch (e) {
            res.statusCode = 400
            res.json(e)
        }
    } else {
        res.statusCode = 403
        return res.json({ 'message': 'Forbidden' })
    }
})

router.get('/:id', async (req, res) => {
    let spot = await Spot.findByPk(req.params.id, {
        include: [{
            model: Review,
            attributes: ['stars'],
        }, {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }, {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
        }]
    })

    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': "Spot couldn't be found" })
    }
    spot = await spot.toJSON()
    const ratingCount = spot.Reviews.length
    spot.numReviews = ratingCount
    let ratingSum = 0
    for (let review of spot.Reviews) {
        ratingSum += review.stars
    }
    spot.avgRating = (ratingSum / ratingCount)
    delete spot.Reviews

    res.json(spot)
})


router.post('/', requireAuth, validateSpots, async (req, res) => {
    const body = req.body
    body.ownerId = req.user.id
    const spot = await Spot.build(body)
    try {
        await spot.validate()
        await spot.save()
        res.json(spot)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})


router.get('/', async (req, res, next) => {
    const queries = req.query
    let filters = {}
    try {
        filters.latMin = parseFloat(queries.minLat) || -90
        filters.latMax = parseFloat(queries.maxLat) || 90
        filters.lngMin = parseFloat(queries.minLng) || -180
        filters.lngMax = parseFloat(queries.maxLng) || 180
        filters.priceMin = parseFloat(queries.minPrice) || 0
        filters.priceMax = parseFloat(queries.maxPrice) || 1000000
        filters.page = parseInt(queries.page) || 1
        filters.size = parseInt(queries.size) || 20
    } catch {
        res.statusCode = 400
        return res.json(e)
    }
    const errors = {}
    if (filters.page < 1) errors.page = "Page must be greater than or equal to 1"
    if (filters.page > 10) errors.page = "Page must be less than or equal to 10"
    if (filters.size < 1) errors.size = "Size must be greater than or equal to 1"
    if (filters.size > 20) errors.size = "Size must be less than or equal to 20"
    if (filters.latMax > 90 || filters.latMax < -90 || filters.latMax < filters.latMin) errors.maxLat = "Maximum latitude is invalid"
    if (filters.latMin > 90 || filters.latMin < -90) errors.minLat = "Minimum latitude is invalid"
    if (filters.lngMax > 180 || filters.lngMax < -180 || filters.lngMax < filters.lngMin) errors.maxLng = "Maximum longitude is invalid"
    if (filters.lngMin > 180 || filters.lngMin < -180) errors.minLng = "Minimum longitude is invalid"
    if (filters.priceMax < 0) errors.maxPrice = "Maximum price must be greater than or equal to 0"
    if (filters.priceMin < 0) errors.minPrice = "Minimum price must be greater than or equal to 0"

    if (Object.keys(errors).length) {
        const err = new Error('Bad Request')
        err.status = 400
        err.errors = errors
        return next(err)
    }

    const offset = (filters.page - 1) * filters.size
    let spots
    try {
        spots = await Spot.findAll({
            include: [{
                model: Review,
                attributes: ['stars'],
            }, {
                model: SpotImage,
                attributes: ['url', 'preview']
            }],
            where: {
                lat: {
                    [Op.gte]: filters.latMin,
                    [Op.lte]: filters.latMax
                },
                lng: {
                    [Op.gte]: filters.lngMin,
                    [Op.lte]: filters.lngMax
                },
                price: {
                    [Op.gte]: filters.priceMin,
                    [Op.lte]: filters.priceMax
                }
            },
            limit: filters.size,
            offset
        })
    } catch (e) {
        res.statusCode = 400
        return res.json(e)
    }

    let result = []
    for (let spot of spots) {
        spot = await spot.toJSON()
        for (let spotImage of spot.SpotImages) {
            if (spotImage.preview === true) {
                spot.previewImage = spotImage.url
            }
        }
        const ratingCount = spot.Reviews.length
        let ratingSum = 0
        for (let review of spot.Reviews) {
            ratingSum += review.stars
        }
        spot.avgRating = (ratingSum / ratingCount)
        delete spot.SpotImages
        delete spot.Reviews
        result.push(spot)
    }
    res.json({ "Spots": result, "page": filters.page, "size": filters.size })
})

module.exports = router;