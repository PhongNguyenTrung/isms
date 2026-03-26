const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup sockets and kafka
const { connectConsumer } = require('./config/kafka');
const { setupKdsSocket } = require('./socket/kdsSocket');

setupKdsSocket(io);

// Middleware
app.use(cors());
app.use(express.json());

// REST API for KDS clients (FR5, FR6)
app.use('/api/kitchen', require('./routes/kitchenRoutes'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'kitchen-service' });
});

// Initializing the port
const PORT = process.env.PORT || 3003;

server.listen(PORT, async () => {
  console.log(`Kitchen Service running on port ${PORT}`);
  await connectConsumer(io);
});
