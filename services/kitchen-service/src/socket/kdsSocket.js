const KitchenQueueManager = require('../services/KitchenQueueManager');

let _broadcast = (event, data) => {
  console.warn('[kdsSocket] broadcast called before socket initialized:', event);
};

const setupKdsSocket = (io) => {
  _broadcast = (event, data) => io.emit(event, data);

  io.on('connection', async (socket) => {
    console.log('New KDS client connected: ' + socket.id);

    try {
      const activeTasks = await KitchenQueueManager.getActiveTasks();
      socket.emit('initial_queue', activeTasks);
    } catch (err) {
      console.error('Error fetching initial queue for KDS', err);
    }

    socket.on('update_task_status', async (data) => {
      try {
        const { taskId, status } = data;
        await KitchenQueueManager.updateTaskStatus(taskId, status, _broadcast);
      } catch (err) {
        console.error('Error updating task status', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('KDS client disconnected: ' + socket.id);
    });
  });
};

// Exposed so REST routes can also trigger socket broadcasts
const getBroadcast = () => _broadcast;

module.exports = { setupKdsSocket, getBroadcast };
