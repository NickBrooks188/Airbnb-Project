const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:id', requireAuth, async (req, res) => {
    const userId = req.user.id
    const reviewImage = await ReviewImage.findByPk(req.params.id, {
        include: {
            model: Review,
            attributes: ['userId']
        }
    })
    if (!reviewImage) {
        res.statusCode = 404
        return res.json({ "message": "Review image does not exist" })
    }
    if (reviewImage.Review.userId === userId) {
        // delete the image and send a message
        await reviewImage.destroy()
        res.json({ 'message': "Successfully deleted review image" })
    } else {
        res.statusCode = 400
        res.json({ "message": "You do not own this image" })
    }
})






module.exports = router;