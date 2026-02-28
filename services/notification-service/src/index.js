const express = require('express');
const dotenv = require('dotenv');
const { connectKafka } = require('./config/kafka');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, async () => {
  console.log(`Notification Service running on port ${PORT}`);
  await connectKafka();
});
