const orderRepository = require('../repositories/orderRepository');
const menuRepository = require('../repositories/menuRepository');
const { publishEvent } = require('../config/kafka');

const placeOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate order items and calculate total
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = await menuRepository.getMenuItemById(item.menuItemId);
      if (!menuItem || !menuItem.is_available) {
        return res.status(400).json({ message: `Menu item ${item.menuItemId} is not available` });
      }
      totalPrice += Number(menuItem.price) * item.quantity;
      validatedItems.push({
        ...item,
        category: menuItem.category
      });
    }

    // Create order in DB
    const order = await orderRepository.createOrder(userId, tableId, items, totalPrice);

    // Publish OrderPlaced event
    const orderEvent = {
      orderId: order.id,
      tableId: tableId,
      items: validatedItems,
      timestamp: new Date().toISOString()
    };

    await publishEvent('orders', `order-${order.id}`, orderEvent);

    return res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
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
