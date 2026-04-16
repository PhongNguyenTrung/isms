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

const getTableBill = async (tableId) => {
  const result = await db.query(
    `SELECT
       o.*,
       COALESCE(json_agg(
         json_build_object(
           'id',                   oi.id,
           'menu_item_id',         oi.menu_item_id,
           'name',                 mi.name_vi,
           'quantity',             oi.quantity,
           'price',                mi.price,
           'special_instructions', oi.special_instructions
         )
       ) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN menu_items  mi ON oi.menu_item_id = mi.id
     WHERE o.table_id = $1 AND o.status NOT IN ('CANCELLED', 'COMPLETED')
     GROUP BY o.id
     ORDER BY o.created_at ASC`,
    [tableId]
  );
  const orders = result.rows;
  const grandTotal = orders.reduce((sum, o) => sum + Number(o.total_price), 0);
  return { orders, grandTotal };
};

const getOrderById = async (orderId) => {
  const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  if (orderResult.rows.length === 0) return null;
  const order = orderResult.rows[0];

  const itemsResult = await db.query(
    'SELECT oi.*, mi.name_vi AS name, mi.name_en, mi.category FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.id WHERE oi.order_id = $1',
    [orderId]
  );
  return { ...order, items: itemsResult.rows };
};

const updateOrderStatus = async (orderId, status) => {
  const result = await db.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return result.rows[0];
};

const getTablesWithActiveOrders = async () => {
  const result = await db.query(
    `SELECT table_id,
            COUNT(*)::int          AS order_count,
            SUM(total_price)       AS grand_total,
            MIN(created_at)        AS first_order_at
     FROM orders
     WHERE status NOT IN ('CANCELLED', 'COMPLETED')
     GROUP BY table_id
     ORDER BY first_order_at ASC`
  );
  return result.rows;
};

const completePaymentForTable = async (tableId) => {
  const result = await db.query(
    `UPDATE orders
     SET status = 'COMPLETED'
     WHERE table_id = $1 AND status NOT IN ('CANCELLED', 'COMPLETED')
     RETURNING id`,
    [tableId]
  );
  return result.rowCount;
};

module.exports = {
  createOrder,
  getOrdersByTable,
  getTableBill,
  getTablesWithActiveOrders,
  completePaymentForTable,
  getOrderById,
  updateOrderStatus
};
