const express = require('express');
const dotenv = require('dotenv');
const { connectKafka } = require('./config/kafka');
const db = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());

// REST endpoint to query recent alerts (for manager dashboard)
app.get('/api/notifications/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM alert_history ORDER BY created_at DESC LIMIT 50'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching alerts', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, async () => {
  console.log(`Notification Service running on port ${PORT}`);
  await connectKafka();
});
