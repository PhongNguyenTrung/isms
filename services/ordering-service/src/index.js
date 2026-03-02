const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectProducer } = require('./config/kafka');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'ordering-service' });
});

// Initializing the port
const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
  console.log(`Ordering Service running on port ${PORT}`);
  await connectProducer();
});
