const express = require('express');
const router = express.Router();
const {
  placeOrder, getTableOrders, getActiveTables, getActiveOrders,
  getTableBill, requestPayment, completePayment,
  getOrderById, confirmOrder, cancelOrder,
} = require('../controllers/orderController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/', placeOrder);

// ⚠️ Static paths must come before /:id
router.get('/active-tables', verifyToken, verifyRole(['CASHIER', 'MANAGER']), getActiveTables);
router.get('/active', verifyToken, verifyRole(['MANAGER', 'WAITER']), getActiveOrders);

router.get('/table/:tableId/bill', getTableBill);
router.post('/table/:tableId/request-payment', requestPayment);
router.post('/table/:tableId/complete-payment', verifyToken, verifyRole(['CASHIER', 'MANAGER']), completePayment);
router.get('/table/:tableId', verifyToken, verifyRole(['WAITER', 'MANAGER', 'CHEF']), getTableOrders);

router.get('/:id', getOrderById);
router.patch('/:id/confirm', verifyToken, verifyRole(['MANAGER', 'WAITER']), confirmOrder);
router.patch('/:id/cancel', verifyToken, verifyRole(['CUSTOMER', 'WAITER', 'MANAGER']), cancelOrder);

module.exports = router;
