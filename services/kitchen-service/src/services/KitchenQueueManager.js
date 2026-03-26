const queueRepository = require('../repositories/queueRepository');
const PriorityCalculator = require('./PriorityCalculator');
const { publishAlert, publishEvent } = require('../config/kafka');

// FR8: Overload threshold — alert when active queue exceeds this count
const OVERLOAD_THRESHOLD = 10;

/**
 * KitchenQueueManager - Domain service for managing the kitchen task queue.
 *
 * Orchestrates: priority calculation → DB persistence → KDS broadcast.
 * Also detects kitchen overload (FR8) and publishes alerts.
 */
class KitchenQueueManager {
  async processIncomingOrder(orderEvent, broadcastFn) {
    const priorityScore = PriorityCalculator.calculate(orderEvent);

    const task = await queueRepository.addOrderToQueue(
      orderEvent.orderId,
      orderEvent.tableId,
      orderEvent.items,
      priorityScore
    );

    broadcastFn('new_kitchen_task', task);

    // FR8: check overload after adding to queue
    await this._checkOverload(broadcastFn);

    return task;
  }

  async updateTaskStatus(taskId, status, broadcastFn) {
    const updatedTask = await queueRepository.updateTaskStatus(taskId, status);
    broadcastFn('task_status_updated', updatedTask);

    // FR13: Publish completion event so analytics can track prep time
    if (status === 'COMPLETED' && updatedTask) {
      const completionPayload = {
        taskId: updatedTask.id,
        orderId: updatedTask.order_id,
        createdAt: updatedTask.created_at,
        completedAt: new Date().toISOString(),
      };
      await publishEvent('kitchen_completed', `completed-${updatedTask.id}`, completionPayload);
    }

    return updatedTask;
  }

  async getActiveTasks() {
    return await queueRepository.getActiveTasks();
  }

  /**
   * FR8: Detects kitchen overload and publishes an alert to Kafka.
   * Alert is broadcasted to KDS via Socket.io and sent to notification-service.
   */
  async _checkOverload(broadcastFn) {
    try {
      const activeTasks = await queueRepository.getActiveTasks();
      if (activeTasks.length >= OVERLOAD_THRESHOLD) {
        const payload = {
          activeTaskCount: activeTasks.length,
          threshold: OVERLOAD_THRESHOLD,
          timestamp: new Date().toISOString(),
        };

        broadcastFn('kitchen_overload', payload);

        await publishAlert('KitchenOverload', `overload-${Date.now()}`, payload);
        console.warn(`[KitchenQueueManager] OVERLOAD DETECTED: ${activeTasks.length} active tasks`);
      }
    } catch (err) {
      console.error('[KitchenQueueManager] Error checking overload:', err);
    }
  }
}

module.exports = new KitchenQueueManager();
