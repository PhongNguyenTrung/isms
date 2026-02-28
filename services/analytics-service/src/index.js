const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const { connectRedis } = require('./config/redis');
const { initSocket } = require('./socket/dashboardSocket');
const { connectKafka } = require('./config/kafka');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io for Real-time Dashboard (FR12)
initSocket(server);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'analytics-service' });
});

// REST endpoint for historical Analytics Reports (FR13, FR14)
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const PORT = process.env.PORT || 3007;

server.listen(PORT, async () => {
  console.log(`Analytics Service running on port ${PORT}`);
  await connectRedis();
  await connectKafka();
});
