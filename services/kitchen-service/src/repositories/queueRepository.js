const db = require('../config/db');

const addOrderToQueue = async (orderId, tableId, items, priorityScore) => {
  const result = await db.query(
    'INSERT INTO kitchen_tasks (order_id, table_id, items, priority_score, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [orderId, tableId, JSON.stringify(items), priorityScore, 'PENDING']
  );
  return result.rows[0];
};

const ORDER_STATUS_MAP = {
  IN_PROGRESS: 'IN_PROGRESS',
  READY: 'READY',
};

const updateTaskStatus = async (taskId, status) => {
  const result = await db.query(
    'UPDATE kitchen_tasks SET status = $1 WHERE id = $2 RETURNING *',
    [status, taskId]
  );
  const task = result.rows[0];

  if (task && ORDER_STATUS_MAP[status]) {
    await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 AND status NOT IN ('COMPLETED', 'CANCELLED')",
      [ORDER_STATUS_MAP[status], task.order_id]
    );
  }

  return task;
};

const getActiveTasks = async () => {
  const result = await db.query(
    "SELECT * FROM kitchen_tasks WHERE status IN ('PENDING', 'IN_PROGRESS') ORDER BY priority_score DESC, created_at ASC"
  );
  return result.rows;
};

module.exports = {
  addOrderToQueue,
  updateTaskStatus,
  getActiveTasks
};
