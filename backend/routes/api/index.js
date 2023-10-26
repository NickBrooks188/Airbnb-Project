// backend/routes/api/index.js
const router = require('express').Router();

// GET /api/set-token-cookie
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');

const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

module.exports = router;