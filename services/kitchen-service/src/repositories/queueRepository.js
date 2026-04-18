const db = require('../config/db');

const addOrderToQueue = async (orderId, tableId, items, priorityScore, station) => {
  const result = await db.query(
    'INSERT INTO kitchen_tasks (order_id, table_id, items, priority_score, status, station) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [orderId, tableId, JSON.stringify(items), priorityScore, 'PENDING', station]
  );
  return result.rows[0];
};

const updateTaskStatus = async (taskId, status) => {
  const result = await db.query(
    'UPDATE kitchen_tasks SET status = $1 WHERE id = $2 RETURNING *',
    [status, taskId]
  );
  const task = result.rows[0];

  // When any task starts cooking → order moves to IN_PROGRESS
  if (task && status === 'IN_PROGRESS') {
    await db.query(
      "UPDATE orders SET status = 'IN_PROGRESS' WHERE id = $1 AND status NOT IN ('IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED')",
      [task.order_id]
    );
  }

  return task;
};

// Returns true when every non-cancelled task for the order is READY or COMPLETED
const areAllTasksReadyForOrder = async (orderId) => {
  const result = await db.query(
    "SELECT COUNT(*) FROM kitchen_tasks WHERE order_id = $1 AND status NOT IN ('READY', 'COMPLETED', 'CANCELLED')",
    [orderId]
  );
  return parseInt(result.rows[0].count) === 0;
};

const getActiveTasks = async () => {
  const result = await db.query(
    "SELECT * FROM kitchen_tasks WHERE status IN ('PENDING', 'IN_PROGRESS') ORDER BY priority_score DESC, created_at ASC"
  );
  return result.rows;
};

module.exports = { addOrderToQueue, updateTaskStatus, areAllTasksReadyForOrder, getActiveTasks };
