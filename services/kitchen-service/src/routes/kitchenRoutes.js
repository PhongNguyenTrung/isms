const express = require('express');
const router = express.Router();
const KitchenQueueManager = require('../services/KitchenQueueManager');
const { getBroadcast } = require('../socket/kdsSocket');

/**
 * GET /api/kitchen/tasks
 * Returns all active kitchen tasks ordered by priority (FR5)
 */
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await KitchenQueueManager.getActiveTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching kitchen tasks', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

/**
 * PATCH /api/kitchen/tasks/:taskId/status
 * Chef updates task status via REST (FR6).
 * Delegates to KitchenQueueManager so broadcast + kitchen_completed event fire correctly.
 */
router.patch('/tasks/:taskId/status', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const validStatuses = ['IN_PROGRESS', 'READY', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const updated = await KitchenQueueManager.updateTaskStatus(taskId, status, getBroadcast());
    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating task status', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

module.exports = router;
