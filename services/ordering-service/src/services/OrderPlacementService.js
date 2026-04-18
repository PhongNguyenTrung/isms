const orderRepository = require('../repositories/orderRepository');
const menuRepository = require('../repositories/menuRepository');

class OrderPlacementService {
  async placeOrder(userId, tableId, items) {
    const { totalPrice } = await this._validateAndCalculate(items);
    return orderRepository.createOrder(userId, tableId, items, totalPrice);
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
}

module.exports = new OrderPlacementService();
