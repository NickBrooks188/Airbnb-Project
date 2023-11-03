const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, ReviewImage, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

router.post('/:id/images', requireAuth, async (req, res) => {
    const userId = req.user.id

    const review = await Review.findByPk(req.params.id, {
        include: [ReviewImage]
    })
    if (!review) {
        res.statusCode = 404
        return res.json({ 'message': "Review couldn't be found" })
    }
    if (review.ReviewImages.length > 9) {
        res.statusCode = 403
        return res.json({ 'message': "Maximum number of images for this resource was reached" })
    }
    if (review.userId !== userId) {
        res.statusCode = 403
        return res.json({ 'message': 'Forbidden' })
    }
    const body = req.body
    try {
        const reviewImage = await review.createReviewImage(body, { validate: true })
        const result = {}
        result.id = reviewImage.id
        result.url = reviewImage.url
        res.json(result)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id

    const reviews = await Review.findAll({
        where: {
            userId
        },
        include: [{
            model: ReviewImage,
            attributes: ['id', 'url']
        }, {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            },
            include: {
                model: SpotImage
            }
        }]
    })

    let result = []
    for (let review of reviews) {
        review = await review.toJSON()
        let previewImage
        console.log(review.Spot.SpotImages)
        for (let spotImage of review.Spot.SpotImages) {
            if (spotImage.preview) {
                review.Spot.previewImage = spotImage.url
                break
            }
        }
        delete review.Spot.SpotImages
        result.push(review)
    }
    res.json({ "Reviews": result })
})

router.put('/:id', requireAuth, validateReviews, async (req, res) => {
    let review = await Review.findByPk(req.params.id)
    if (!review) {
        res.statusCode = 404
        return res.json({ 'message': "Review couldn't be found" })
    }
    const update = req.body

    if (req.user.id !== review.userId) {
        res.statusCode = 403
        return res.json({ 'message': "Forbidden" })
    }

    let now = new Date()
    review.review = update.review
    review.stars = update.stars
    review.updatedAt = now
    try {
        await review.validate()
        await review.save()
        res.json(review)
    } catch (e) {
        res.statusCode = 400
        res.json(e)
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    const userId = req.user.id
    const review = await Review.findByPk(req.params.id, {
    })
    if (!review) {
        res.statusCode = 404
        return res.json({ "message": "Review couldn't be found" })
    }
    if (review.userId === userId) {
        await review.destroy()
        res.json({ "message": "Successfully deleted" })
    } else {
        res.statusCode = 403
        res.json({ "message": "Forbidden" })
    }
})

module.exports = router;