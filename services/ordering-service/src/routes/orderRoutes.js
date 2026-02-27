const express = require('express');
const router = express.Router();
const { placeOrder, getTableOrders } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, verifyRole(['CUSTOMER', 'WAITER', 'MANAGER']), placeOrder);
router.get('/table/:tableId', verifyToken, verifyRole(['WAITER', 'MANAGER', 'CHEF']), getTableOrders);

module.exports = router;
