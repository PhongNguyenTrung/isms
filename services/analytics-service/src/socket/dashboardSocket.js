const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Client connected to Analytics Dashboard:', socket.id);
    buildInitialState(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected from Dashboard:', socket.id);
    });
  });
};

const buildInitialState = async (socket) => {
  // Push full state down to the client immediately upon connection
  // E.g. retrieving current cached values from Redis via MetricsAggregator check
  // For now, we omit the direct fetching loop for simplicity
};

/**
 * Broadcasts a live metric update to all connected dashboard clients
 */
const broadcastMetricUpdate = (metricName, payload) => {
  if (io) {
    io.emit('metric_update', { metric: metricName, data: payload });
  }
};

module.exports = { initSocket, broadcastMetricUpdate };
