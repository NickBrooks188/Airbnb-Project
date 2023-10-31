const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, ReviewImage, Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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
            model: Spot
        }]
    })
    res.json(reviews)
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