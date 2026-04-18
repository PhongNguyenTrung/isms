const orderRepository = require('../repositories/orderRepository');
const OrderPlacementService = require('../services/OrderPlacementService');
const tableSessionRepository = require('../repositories/tableSessionRepository');
const { publishEvent } = require('../config/kafka');
const db = require('../config/db');

const placeOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body;
    const userId = req.user?.id ?? null;

    const order = await OrderPlacementService.placeOrder(userId, tableId, items);

    return res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Error placing order', error);
    return res.status(500).json({ message: 'Server error placing order' });
  }
};

const getTableOrders = async (req, res) => {
  try {
    const { tableId } = req.params;
    const orders = await orderRepository.getOrdersByTable(tableId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders', error);
    return res.status(500).json({ message: 'Server error fetching orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderRepository.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order', error);
    return res.status(500).json({ message: 'Server error fetching order' });
  }
};

const getActiveOrders = async (req, res) => {
  try {
    const orders = await orderRepository.getAllActiveOrders();
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching active orders', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderRepository.getOrderById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'PLACED') {
      return res.status(400).json({ message: `Không thể tiếp nhận đơn có trạng thái ${order.status}` });
    }
    const updated = await orderRepository.updateOrderStatus(id, 'CONFIRMED');

    // Publish to Kafka → kitchen-service tạo task PENDING
    await publishEvent('orders', `order-${order.id}`, {
      orderId: order.id,
      tableId: order.table_id,
      items: order.items.map((i) => ({
        menuItemId: i.menu_item_id,
        quantity: i.quantity,
        name: i.name,
        category: i.category,
        specialInstructions: i.special_instructions,
      })),
      total_price: order.total_price,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({ message: 'Đã tiếp nhận đơn', order: updated });
  } catch (error) {
    console.error('Error confirming order', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderRepository.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (!['PLACED', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order with status ${order.status}` });
    }
    const updated = await orderRepository.updateOrderStatus(id, 'CANCELLED');

    // Huỷ kitchen task nếu chưa hoàn thành (dùng shared DB)
    await db.query(
      "UPDATE kitchen_tasks SET status = 'CANCELLED' WHERE order_id = $1 AND status NOT IN ('COMPLETED', 'CANCELLED')",
      [id]
    );

    return res.status(200).json({ message: 'Đã từ chối đơn', order: updated });
  } catch (error) {
    console.error('Error cancelling order', error);
    return res.status(500).json({ message: 'Server error cancelling order' });
  }
};

const getActiveTables = async (req, res) => {
  try {
    const tables = await orderRepository.getTablesWithActiveOrders();
    return res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching active tables', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const completePayment = async (req, res) => {
  try {
    const { tableId } = req.params;
    const updated = await orderRepository.completePaymentForTable(tableId);
    if (updated === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng đang hoạt động cho bàn này' });
    }
    await publishEvent('payment-completed', `payment-done-${tableId}`, {
      tableId,
      completedAt: new Date().toISOString(),
    });

    // Invalidate QR session — bàn đã thanh toán, token cũ không dùng được nữa
    await tableSessionRepository.invalidateByTableId(tableId);

    return res.status(200).json({ message: `Đã xác nhận thanh toán cho bàn ${tableId}`, updated });
  } catch (error) {
    console.error('Error completing payment', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getTableBill = async (req, res) => {
  try {
    const { tableId } = req.params;
    const bill = await orderRepository.getTableBill(tableId);
    return res.status(200).json(bill);
  } catch (error) {
    console.error('Error fetching table bill', error);
    return res.status(500).json({ message: 'Server error fetching bill' });
  }
};

const requestPayment = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { grandTotal } = await orderRepository.getTableBill(tableId);
    await publishEvent('payment-requests', `payment-${tableId}`, {
      tableId,
      grandTotal,
      timestamp: new Date().toISOString(),
    });
    return res.status(200).json({ message: 'Đã gọi thanh toán, nhân viên sẽ đến ngay!' });
  } catch (error) {
    console.error('Error requesting payment', error);
    return res.status(500).json({ message: 'Server error requesting payment' });
  }
};

module.exports = { placeOrder, getTableOrders, getActiveTables, getActiveOrders, getTableBill, requestPayment, completePayment, getOrderById, confirmOrder, cancelOrder };

