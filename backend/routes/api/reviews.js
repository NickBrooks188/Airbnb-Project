const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, ReviewImage, review } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.post('/:id/images', requireAuth, async (req, res) => {
    const userId = req.user.id

    const review = await Review.findByPk(req.params.id, {
        include: [ReviewImage]
    })
    if (!review) {
        res.statusCode = 404
        return res.json({ 'message': 'Review does not exist' })
    }
    if (review.ReviewImages.length > 9) {
        res.statusCode = 403
        return res.json({ 'message': 'This review already has the maximum number of images' })
    }
    if (review.userId !== userId) {
        res.statusCode = 403
        return res.json({ 'message': 'You do not own this review' })
    }
    const body = req.body
    try {
        const reviewImage = await review.createReviewImage(body)
        const returnData = {}
        returnData.id = reviewImage.id
        returnData.url = reviewImage.url
        res.json(returnData)
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
        }]
    })
    res.json(reviews)
})

router.put('/:id', requireAuth, async (req, res) => {
    let review = await Review.findByPk(req.params.id)
    if (!review) {
        res.statusCode = 404
        return res.json({ 'message': 'Review does not exist' })
    }
    const update = req.body

    if (req.user.id === review.userId) {
        let now = new Date()
        review.userId = update.userId || review.userId
        review.spotId = update.spotId || review.spotId
        review.review = update.review || review.review
        review.stars = update.stars || review.stars
        review.updatedAt = now
        try {
            await review.validate()
            await review.save()
            res.json(review)
        } catch (e) {
            res.statusCode = 400
            res.json(e)
        }
    } else {
        res.statusCode = 400
        return res.json({ 'message': 'You are not the owner of this review' })
    }
})

router.delete('/:id', requireAuth, async (req, res) => {
    const userId = req.user.id
    const review = await Review.findByPk(req.params.id, {
    })
    if (!review) {
        res.statusCode = 404
        return res.json({ "message": "Review does not exist" })
    }
    if (review.userId === userId) {
        await review.destroy()
        res.json({ 'message': "Successfully deleted review" })
    } else {
        res.statusCode = 400
        res.json({ "message": "You do not own this review" })
    }
})

module.exports = router;