const { Server } = require('socket.io');
const { redisClient } = require('../config/redis');
const MetricsAggregator = require('../services/MetricsAggregator');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  // Inject broadcast function into the domain service
  MetricsAggregator.setBroadcastFn(broadcastMetricUpdate);

  io.on('connection', (socket) => {
    console.log('Client connected to Analytics Dashboard:', socket.id);
    buildInitialState(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected from Dashboard:', socket.id);
    });
  });
};

const buildInitialState = async (socket) => {
  try {
    const activeOrders = await redisClient.get('metric:active_orders');
    const dailyRevenue = await redisClient.get('metric:daily_revenue');
    const prepTimes = await redisClient.lRange('metric:prep_times', 0, -1);
    const avgPrepTime = prepTimes.length > 0
      ? Math.round(prepTimes.reduce((s, t) => s + Number(t), 0) / prepTimes.length)
      : 0;

    socket.emit('initial_state', {
      active_orders: activeOrders ? Number(activeOrders) : 0,
      daily_revenue: dailyRevenue ? Number(dailyRevenue) : 0,
      avg_prep_time: avgPrepTime,
    });
  } catch (err) {
    console.error('Error loading initial dashboard state:', err);
  }
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

