const queueRepository = require('../repositories/queueRepository');
const PriorityCalculator = require('./PriorityCalculator');
const { publishAlert, publishEvent } = require('../config/kafka');

const OVERLOAD_THRESHOLD = 10;

// Maps menu category → kitchen station
const CATEGORY_STATION = {
  MAIN_DISH:  'Bếp chính',
  APPETIZER:  'Bếp chính',
  BEVERAGE:   'Quầy bar',
  DESSERT:    'Tráng miệng',
};

function splitItemsByStation(items) {
  const groups = {};
  for (const item of items) {
    const station = CATEGORY_STATION[item.category] || 'Bếp chính';
    if (!groups[station]) groups[station] = [];
    groups[station].push(item);
  }
  return groups; // { 'Bếp chính': [...], 'Quầy bar': [...] }
}

class KitchenQueueManager {
  async processIncomingOrder(orderEvent, broadcastFn) {
    const stationGroups = splitItemsByStation(orderEvent.items || []);
    const tasks = [];

    for (const [station, items] of Object.entries(stationGroups)) {
      const priorityScore = PriorityCalculator.calculate({ ...orderEvent, items });
      const task = await queueRepository.addOrderToQueue(
        orderEvent.orderId,
        orderEvent.tableId,
        items,
        priorityScore,
        station,
      );
      broadcastFn('new_kitchen_task', task);
      tasks.push(task);
    }

    await this._checkOverload(broadcastFn);
    return tasks;
  }

  async updateTaskStatus(taskId, status, broadcastFn) {
    const updatedTask = await queueRepository.updateTaskStatus(taskId, status);
    broadcastFn('task_status_updated', updatedTask);

    if (status === 'READY' && updatedTask) {
      // Only notify ordering-service when ALL stations for this order are done
      const allReady = await queueRepository.areAllTasksReadyForOrder(updatedTask.order_id);
      if (allReady) {
        await publishEvent('kitchen_ready', `ready-${updatedTask.order_id}`, {
          orderId: updatedTask.order_id,
          tableId: updatedTask.table_id,
          taskId:  updatedTask.id,
        });
      }
    }

    // FR13: publish per-task completion for analytics prep-time tracking
    if (status === 'COMPLETED' && updatedTask) {
      await publishEvent('kitchen_completed', `completed-${updatedTask.id}`, {
        taskId:      updatedTask.id,
        orderId:     updatedTask.order_id,
        station:     updatedTask.station,
        createdAt:   updatedTask.created_at,
        completedAt: new Date().toISOString(),
      });
    }

    return updatedTask;
  }

  async getActiveTasks() {
    return queueRepository.getActiveTasks();
  }

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
        console.warn(`[KitchenQueueManager] OVERLOAD: ${activeTasks.length} active tasks`);
      }
    } catch (err) {
      console.error('[KitchenQueueManager] Error checking overload:', err);
    }
  }
}

module.exports = new KitchenQueueManager();
