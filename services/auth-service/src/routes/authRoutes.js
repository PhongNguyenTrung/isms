const express = require('express');
const router = express.Router();
const { register, login, refreshToken, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', verifyToken, getProfile);

module.exports = router;
