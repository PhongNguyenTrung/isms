const { Kafka } = require('kafkajs');
const KitchenQueueManager = require('../services/KitchenQueueManager');

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

    const broadcast = (event, data) => io.emit(event, data);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const orderEvent = JSON.parse(message.value.toString());
          console.log(`Received order event: ${orderEvent.orderId}`);

          await KitchenQueueManager.processIncomingOrder(orderEvent, broadcast);
        } catch (err) {
          console.error('Error processing order event:', err);
        }
      },
    });
  } catch (error) {
    console.error('Failed to connect to Kafka consumer', error);
  }
};

module.exports = { connectConsumer };
