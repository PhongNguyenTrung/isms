const express = require('express');
const router = express.Router();
const { placeOrder, getTableOrders, getActiveTables, getTableBill, requestPayment, completePayment, getOrderById, cancelOrder } = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', placeOrder);
router.get('/active-tables', getActiveTables);
router.get('/table/:tableId/bill', getTableBill);
router.post('/table/:tableId/request-payment', requestPayment);
router.post('/table/:tableId/complete-payment', completePayment);
router.get('/table/:tableId', verifyToken, verifyRole(['WAITER', 'MANAGER', 'CHEF']), getTableOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', verifyToken, verifyRole(['CUSTOMER', 'WAITER', 'MANAGER']), cancelOrder);

module.exports = router;
