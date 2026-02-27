const { Kafka } = require('kafkajs');
const queueRepository = require('../repositories/queueRepository');

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'kitchen-service',
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: 'kitchen-group' });

const connectConsumer = async (io) => {
  try {
    await consumer.connect();
    console.log('Successfully connected to Kafka consumer');

    await consumer.subscribe({ topic: 'orders', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const eventValue = JSON.parse(message.value.toString());
        console.log(`Received order event: ${eventValue.orderId}`);

        // Simple Priority Calculation
        const priorityScore = calculatePriority(eventValue);

        // Add to kitchen queue
        const task = await queueRepository.addOrderToQueue(
          eventValue.orderId,
          eventValue.tableId,
          eventValue.items,
          priorityScore
        );

        // Broadcast new task to KDS displays
        io.emit('new_kitchen_task', task);
      },
    });
  } catch (error) {
    console.error('Failed to connect to Kafka consumer', error);
  }
};

const calculatePriority = (order) => {
  // Simple mock priority calculation
  // FR7: Dish complexity (30%), Wait time (40%), Customer type (20%), Kitchen load (10%)
  let baseScore = 5;
  if (order.items.length > 3) baseScore += 2; // Complex order
  return baseScore;
};

module.exports = { connectConsumer };
