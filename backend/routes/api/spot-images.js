const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, User, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:id', requireAuth, async (req, res) => {
    const userId = req.user.id
    const spotImage = await SpotImage.findByPk(req.params.id, {
        include: {
            model: Spot,
            attributes: ['ownerId']
        }
    })
    if (!spotImage) {
        res.statusCode = 404
        return res.json({ "message": `Spot Image couldn't not be found` })
    }

    if (spotImage.Spot.ownerId === userId) {
        // delete the spot and send a message
        await spotImage.destroy()
        res.json({ 'message': "Successfully deleted" })
    } else {
        res.statusCode = 403
        res.json({ "message": "Forbidden" })
    }
})






module.exports = router;