const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/:id/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id)
    // const reviews = await Spot.getReviews()
    const reviews = await Review.findAll({
        // include: {
        //     model: ReviewImage
        // }
    })
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

    return res.json(spot)
})

router.get('/:id/bookings', async (req, res) => {
    // const bookings = await
})

router.get('/:id', async (req, res) => {
    let spot = await Spot.findByPk(req.params.id, {
        include: [{
            model: User,
            attributes: ['id'],
            through: {
                model: Review,
                attributes: ['stars']
            }
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
    const ratingCount = spot.Users.length
    spot.numReviews = ratingCount
    let ratingSum = 0
    for (let user of spot.Users) {
        ratingSum += user.Review.stars
    }
    spot.avgRating = (ratingSum / ratingCount)
    delete spot.Users

    res.json(spot)
})

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [{
            model: User,
            attributes: ['id'],
            through: {
                attributes: ['stars']
            }
        }, {
            model: SpotImage,
            attributes: ['url', 'preview']
        }]
    })

    let spotArr = []
    for (let spot of spots) {
        spot = await spot.toJSON()
        for (let spotImage of spot.SpotImages) {
            console.log(spotImage.preview)
            if (spotImage.preview === true) {
                spot.previewImage = spotImage.url
            }
        }
        const ratingCount = spot.Users.length
        let ratingSum = 0
        for (let user of spot.Users) {
            ratingSum += user.Review.stars
        }
        spot.avgRating = (ratingSum / ratingCount)
        delete spot.SpotImages
        delete spot.Users
        spotArr.push(spot)
    }
    res.json(spotArr)
})

module.exports = router;