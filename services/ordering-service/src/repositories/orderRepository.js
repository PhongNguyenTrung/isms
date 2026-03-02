const db = require('../config/db');

const createOrder = async (userId, tableId, items, totalPrice) => {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, table_id, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, tableId, totalPrice, 'PLACED']
    );

    const order = orderResult.rows[0];
    const orderItems = [];

    for (const item of items) {
      const orderItemResult = await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, special_instructions) VALUES ($1, $2, $3, $4) RETURNING *',
        [order.id, item.menuItemId, item.quantity, item.specialInstructions || '']
      );
      orderItems.push(orderItemResult.rows[0]);
    }

    await client.query('COMMIT');

    return { ...order, items: orderItems };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getOrdersByTable = async (tableId) => {
  const result = await db.query('SELECT * FROM orders WHERE table_id = $1 ORDER BY created_at DESC', [tableId]);
  return result.rows;
};

module.exports = {
  createOrder,
  getOrdersByTable
};
