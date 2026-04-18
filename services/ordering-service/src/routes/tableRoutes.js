const express = require('express');
const router = express.Router();
const { resolveSession, createSession, getActiveToken } = require('../controllers/tableController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

// Public: tablet dùng để đổi token → tableId
router.get('/resolve', resolveSession);

// Manager only: tạo QR session cho bàn
router.post('/sessions', verifyToken, verifyRole(['MANAGER']), createSession);

// Tablet cố định: poll để phát hiện session mới (không cần auth)
router.get('/active-token/:tableId', getActiveToken);

module.exports = router;
