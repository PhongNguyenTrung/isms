const db = require('../config/db');

const addOrderToQueue = async (orderId, tableId, items, priorityScore) => {
  const result = await db.query(
    'INSERT INTO kitchen_tasks (order_id, table_id, items, priority_score, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [orderId, tableId, JSON.stringify(items), priorityScore, 'PENDING']
  );
  return result.rows[0];
};

const updateTaskStatus = async (taskId, status) => {
  const result = await db.query(
    'UPDATE kitchen_tasks SET status = $1 WHERE id = $2 RETURNING *',
    [status, taskId]
  );
  return result.rows[0];
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
