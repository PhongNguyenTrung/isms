const orderRepository = require('../repositories/orderRepository');
const menuRepository = require('../repositories/menuRepository');
const { publishEvent } = require('../config/kafka');

class OrderPlacementService {
  /**
   * Validates items, calculates total, persists the order, and publishes OrderPlaced event.
   * Throws an error with a `statusCode` property if validation fails.
   */
  async placeOrder(userId, tableId, items) {
    const { totalPrice, validatedItems } = await this._validateAndCalculate(items);

    const order = await orderRepository.createOrder(userId, tableId, items, totalPrice);

    await this._publishOrderPlaced(order, tableId, validatedItems);

    return order;
  }

  async _validateAndCalculate(items) {
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = await menuRepository.getMenuItemById(item.menuItemId);

      if (!menuItem || !menuItem.is_available) {
        const error = new Error(`Menu item ${item.menuItemId} is not available`);
        error.statusCode = 400;
        throw error;
      }

      totalPrice += Number(menuItem.price) * item.quantity;
      validatedItems.push({ ...item, name: menuItem.name_vi, category: menuItem.category });
    }

    return { totalPrice, validatedItems };
  }

  async _publishOrderPlaced(order, tableId, validatedItems) {
    const orderEvent = {
      orderId: order.id,
      tableId,
      items: validatedItems,
      total_price: order.total_price,
      timestamp: new Date().toISOString()
    };

    await publishEvent('orders', `order-${order.id}`, orderEvent);
  }
}

module.exports = new OrderPlacementService();
