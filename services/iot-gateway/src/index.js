const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { connectProducer } = require('./config/kafka');
const { connectMqtt } = require('./config/mqtt');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'iot-gateway' });
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, async () => {
  console.log(`IoT Gateway running on port ${PORT}`);
  await connectProducer();
  connectMqtt();
});
