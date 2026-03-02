const queueRepository = require('../repositories/queueRepository');
const PriorityCalculator = require('./PriorityCalculator');

/**
 * KitchenQueueManager - Domain service for managing the kitchen task queue.
 *
 * Orchestrates: priority calculation → DB persistence → KDS broadcast.
 * Keeps the Kafka consumer and Socket.io handlers as thin infrastructure adapters.
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

    return task;
  }

  async updateTaskStatus(taskId, status, broadcastFn) {
    const updatedTask = await queueRepository.updateTaskStatus(taskId, status);
    broadcastFn('task_status_updated', updatedTask);
    return updatedTask;
  }

  async getActiveTasks() {
    return await queueRepository.getActiveTasks();
  }
}

module.exports = new KitchenQueueManager();
