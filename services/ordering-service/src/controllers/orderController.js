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

module.exports = { placeOrder, getTableOrders };

