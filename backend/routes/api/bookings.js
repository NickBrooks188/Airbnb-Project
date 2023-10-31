const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, User, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const bookings = await Spot.findAll({
        include: [{
            model: User,
            where: {
                id: userId
            },
            attributes: ['id'],
            through: {
                model: Booking,
                attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
            },
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
    for (let booking of bookings) {
        booking = await booking.toJSON()
        let temp = {}
        temp = booking.Users[0].Booking
        temp.Spot = {}
        let imageURL
        if (booking.SpotImages[0]) imageURL = booking.SpotImages[0].url
        delete booking.Users
        delete booking.SpotImages
        temp.Spot = booking
        if (imageURL) temp.Spot.previewImage = imageURL
        result.push(temp)
    }

    res.json(result)
})

module.exports = router;