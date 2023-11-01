const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Op } = require("sequelize");

router.post('/:id/images', requireAuth, async (req, res) => {
    const ownerId = req.user.id

    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    if (ownerId !== spot.ownerId) {
        res.statusCode = 400
        return res.json({ 'message': 'You are not the owner of this spot' })
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

router.post('/:id/reviews', requireAuth, async (req, res) => {
    const userId = req.user.id

    const spot = await Spot.findByPk(req.params.id, {
        include: [Review]
    })
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    for (existingReview of spot.Reviews) {
        if (existingReview.userId === userId) {
            res.statusCode = 403
            return res.json({ 'message': 'You have already written a review for this spot' })
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

router.post('/:id/bookings', requireAuth, async (req, res) => {
    const userId = req.user.id

    const spot = await Spot.findByPk(req.params.id)
    const body = req.body
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    if (spot.ownerId === userId) {
        res.statusCode = 403
        return res.json({ 'message': 'You cannot make a booking for a spot you own' })
    }
    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        }
    })
    console.log(bookings)
    let startTime = new Date(body.startDate).getTime()
    let endTime = new Date(body.endDate).getTime()
    for (existingBooking of bookings) {
        if (existingBooking.userId === userId && existingBooking.startDate.getTime() == startTime && existingBooking.endDate.getTime() == endTime) {
            res.statusCode = 403
            return res.json({ 'message': 'You already have a booking for this spot on those dates' })
        }
    }
    body.userId = userId
    body.spotId = spot.id
    console.log(body)
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
        return res.json({ 'message': 'Spot does not exist' })
    }
    const reviewtest = await Review.findAll({
        include: [ReviewImage]
    })

    // query for all reviews with specified attributes
    const reviews = await Review.findAll({
        where: {
            spotId: req.params.id
        },
        attributes: ['id', 'spotId', 'userId', 'review', 'stars', 'createdAt', 'updatedAt']
    })

    // build an array of all userIds in the reviews, then an array for all reviewIds
    let userIds = []
    let reviewIds = []

    for (let review of reviews) {
        userIds.push(review.userId)
        reviewIds.push(review.id)
    }

    // query for all users with ids in the first array, limiting attributes to id, firstName, lastName
    const users = await User.findAll({
        where: {
            id: {
                [Op.in]: userIds
            }
        },
        attributes: ['id', 'firstName', 'lastName']
    })
    // query for all images with reviewId in the array, limiting attributes to id and url
    const images = await ReviewImage.findAll({
        where: {
            reviewId: {
                [Op.in]: reviewIds
            }
        },
        attributes: ['id', 'url', 'reviewId']
    })
    let results = []
    // iterate through reviews, tacking on appropriate user and images
    for (let review of reviews) {
        review = await review.toJSON()
        for (let user of users) {
            if (user.id == review.userId) {
                review.User = {}
                review.User.id = user.id
                review.User.firstName = user.firstName
                review.User.lastName = user.lastName
                break
            }
        }
        review.ReviewImages = []
        for (let image of images) {
            if (image.reviewId === review.id) {
                const temp = {}
                temp.id = image.id
                temp.url = image.url
                review.ReviewImages.push(temp)
            }
        }
        results.push(review)
    }

    return res.json(results)
})

router.get('/:id/bookings', requireAuth, async (req, res) => {

    // find spot
    const spot = await Spot.findByPk(req.params.id)
    // confirm spot exists
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    let owner = false
    if (req.user.id === spot.ownerId) owner = true

    // find all bookings with spotId matching the spot's id, with more attributes if user is the owner
    let bookingAttributes = []
    if (owner) { bookingAttributes = ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'] }
    else { bookingAttributes = ['spotId', 'startDate', 'endDate'] }
    const bookings = await Booking.findAll({
        where: {
            spotId: spot.id
        },
        attributes: bookingAttributes
    })

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
    console.log(users)
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
        return res.json(result)

    }
    res.json(bookings)
    // res.json(result)
})

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const spots = await Spot.findAll({
        where: {
            ownerId: userId
        },
        include: [{
            model: User,
            attributes: ['id'],
            through: {
                model: Review,
                attributes: ['stars']
            }
        },
        {
            model: SpotImage,
            attributes: ['url', 'preview'],
        }]
    })
    let result = []
    for (let spot of spots) {
        spot = await spot.toJSON()
        let temp = {}
        let imageURL
        for (let spotImage of spot.SpotImages) {
            if (spotImage.preview) imageURL = SpotImage.url
            break
        }
        let reviewCount = spot.Users.length
        let reviewSum = 0
        for (let review of spot.Users) {
            reviewSum += review.Booking.stars
        }
        delete spot.Users
        delete spot.SpotImages
        temp = spot
        temp.avgRating = reviewSum / reviewCount
        temp.previewImage = imageURL
        result.push(temp)
    }

    res.json(result)
})

router.delete('/:id', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    if (req.user.id === spot.ownerId) {
        await spot.destroy()
        res.json({ 'message': 'successful deletion' })
    } else {
        res.statusCode = 400
        return res.json({ 'message': 'You are not the owner of this spot' })
    }
})

router.put('/:id', requireAuth, async (req, res) => {
    let spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    const update = req.body

    if (req.user.id === spot.ownerId) {
        let now = new Date()
        spot.ownerId = update.ownerId || spot.ownerId
        spot.address = update.address || spot.address
        spot.city = update.city || spot.city
        spot.state = update.state || spot.state
        spot.country = update.country || spot.country
        spot.lat = update.lat || spot.lat
        spot.lng = update.lng || spot.lng
        spot.name = update.name || spot.name
        spot.description = update.description || spot.description
        spot.price = update.price || spot.price
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
        res.statusCode = 400
        return res.json({ 'message': 'You are not the owner of this spot' })
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
        return res.json({ 'message': 'Spot does not exist' })
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


router.post('/', requireAuth, async (req, res) => {
    const body = req.body
    console.log(body)
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


router.get('/', async (req, res) => {
    const queries = req.query
    console.log(queries)
    let where = {}
    if (queries.minLat) {
        where
    }
    const spots = await Spot.findAll({
        include: [{
            model: Review,
            attributes: ['stars'],
        }, {
            model: SpotImage,
            attributes: ['url', 'preview']
        }]
    })

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
    res.json(result)
})

module.exports = router;