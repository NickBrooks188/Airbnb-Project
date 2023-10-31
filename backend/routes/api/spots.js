const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Op } = require("sequelize");

router.get('/:id/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id)
    if (!spot) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    const reviewtest = await Review.findAll({
        include: [ReviewImage]
    })
    // console.log(reviews)

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



    // console.log(reviews)
    // const spot = await Spot.findByPk(req.params.id, {
    //     attributes: [],
    //     include: {
    //         model: User,
    //         attributes: ['id'],
    //         through: {
    //             model: Review,
    //             attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    //             include: [{
    //                 model: ReviewImage
    //             }]
    //         }
    //     }
    // })
    // if (!spot) {
    //     res.statusCode = 404
    //     return res.json({ 'message': 'Spot does not exist' })
    // }
    // const reviews = await Review.findAll({
    //     where: {
    //         spotId: req.params.id
    //     },
    //     attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    //     include: [{
    //         model: User,
    //         attributes: ['id'],
    //         where: {
    //             id: 
    //         }
    //     }]
    // })

    // const reviews = await ReviewImage.findAll()

    return res.json(results)
})

router.get('/:id/bookings', requireAuth, async (req, res) => {
    // check if user is logged in
    // check if user is owner of spot

    let bookingAttributes = ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    let userAttributes = ['id', 'firstName', 'lastName']
    const bookings = await Spot.findByPk(req.params.id, {
        attributes: ['ownerId'],
        include: {
            model: User,
            attributes: userAttributes,
            through: {
                model: Booking,
                attributes: bookingAttributes
            }
        }
    })

    let owner = false
    if (req.user.id === bookings.ownerId) owner = true


    if (!bookings) {
        res.statusCode = 404
        return res.json({ 'message': 'Spot does not exist' })
    }
    console.log(bookings.Users)
    let result = []
    for (let booking of bookings.Users) {
        booking = await booking.toJSON()
        const temp = {}
        const bookingDetails = booking.Booking
        temp.spotId = bookingDetails.spotId
        temp.startDate = bookingDetails.startDate
        temp.endDate = bookingDetails.endDate
        if (owner) {
            temp.id = bookingDetails.id
            temp.userId = bookingDetails.userId
            temp.createdAt = bookingDetails.createdAt
            temp.updatedAt = bookingDetails.updatedAt
            temp.User = {}
            temp.User.id = booking.id
            temp.User.firstName = booking.firstName
            temp.User.lastName = booking.lastName
        }

        result.push(temp)
    }

    res.json(result)
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
            attributes: ['url'],
            where: {
                preview: true
            }
        }]
    })

    let result = []
    for (let spot of spots) {
        spot = await spot.toJSON()
        let temp = {}
        let imageURL
        if (spot.SpotImages[0]) imageURL = spot.SpotImages[0].url
        let reviewCount = spot.Users.length
        let reviewSum = 0
        for (let review of spot.Users) {
            reviewSum += review.Review.stars
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
    console.log(spot)
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

router.get('/', async (req, res) => {
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