const orderRepository = require('../repositories/orderRepository');
const OrderPlacementService = require('../services/OrderPlacementService');

const placeOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body;
    const userId = req.user.id;

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
    return res.status(200).json({ message: 'Order cancelled', order: updated });
  } catch (error) {
    console.error('Error cancelling order', error);
    return res.status(500).json({ message: 'Server error cancelling order' });
  }
};

module.exports = { placeOrder, getTableOrders, getOrderById, cancelOrder };

