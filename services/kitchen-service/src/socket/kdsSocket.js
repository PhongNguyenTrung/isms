const queueRepository = require('../repositories/queueRepository');

const setupKdsSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('New KDS client connected: ' + socket.id);

    // Send existing active tasks upon connection
    try {
      const activeTasks = await queueRepository.getActiveTasks();
      socket.emit('initial_queue', activeTasks);
    } catch (err) {
      console.error('Error fetching initial queue for KDS', err);
    }

    // Handle status updates from KDS
    socket.on('update_task_status', async (data) => {
      try {
        const { taskId, status } = data;
        const updatedTask = await queueRepository.updateTaskStatus(taskId, status);

        // Broadcast the update to all connected KDS displays
        io.emit('task_status_updated', updatedTask);

        // Here we could also publish an `OrderInProgress` or `OrderCompleted` event back to Kafka
      } catch (err) {
        console.error('Error updating task status', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('KDS client disconnected: ' + socket.id);
    });
  });
};

module.exports = { setupKdsSocket };
