const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectProducer, connectConsumer } = require('./config/kafka');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/table', tableRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'ordering-service' });
});

// Initializing the port
const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
  console.log(`Ordering Service running on port ${PORT}`);
  await connectProducer();
  await connectConsumer();
});
