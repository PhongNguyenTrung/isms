const express = require('express');
const router = express.Router();
const { placeOrder, getTableOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, verifyRole(['CUSTOMER', 'WAITER', 'MANAGER']), placeOrder);
router.get('/table/:tableId', verifyToken, verifyRole(['WAITER', 'MANAGER', 'CHEF']), getTableOrders);
router.get('/:id', verifyToken, verifyRole(['CUSTOMER', 'WAITER', 'MANAGER', 'CHEF']), getOrderById);
router.patch('/:id/cancel', verifyToken, verifyRole(['CUSTOMER', 'WAITER', 'MANAGER']), cancelOrder);

module.exports = router;
