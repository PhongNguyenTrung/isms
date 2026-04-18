const jwt = require('jsonwebtoken');
const KitchenQueueManager = require('../services/KitchenQueueManager');

let _broadcast = (event, data) => {
  console.warn('[kdsSocket] broadcast called before socket initialized:', event);
};

const KDS_VIEWERS = ['CHEF', 'MANAGER', 'WAITER'];
const KDS_UPDATERS = ['CHEF', 'MANAGER'];

const setupKdsSocket = (io) => {
  _broadcast = (event, data) => io.emit(event, data);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(new Error('Token không hợp lệ'));
      if (!KDS_VIEWERS.includes(user.role)) return next(new Error('Không có quyền truy cập KDS'));
      socket.user = user;
      next();
    });
  });

  io.on('connection', async (socket) => {
    console.log(`New KDS client connected: ${socket.id} (${socket.user.username}/${socket.user.role})`);

    try {
      const activeTasks = await KitchenQueueManager.getActiveTasks();
      socket.emit('initial_queue', activeTasks);
    } catch (err) {
      console.error('Error fetching initial queue for KDS', err);
    }

    socket.on('update_task_status', async (data) => {
      if (!KDS_UPDATERS.includes(socket.user.role)) {
        socket.emit('error', { message: 'Không có quyền cập nhật trạng thái đơn' });
        return;
      }
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
