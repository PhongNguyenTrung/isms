const express = require('express');
const dotenv = require('dotenv');
const { connectKafka } = require('./config/kafka');
const { closeInflux } = require('./config/influxdb');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'inventory-service' });
});

const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, async () => {
  console.log(`Inventory Service running on port ${PORT}`);
  await connectKafka();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await closeInflux();
  server.close(() => {
    process.exit(0);
  });
});
