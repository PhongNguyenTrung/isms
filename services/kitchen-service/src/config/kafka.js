const { Kafka } = require('kafkajs');
const KitchenQueueManager = require('../services/KitchenQueueManager');

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'kitchen-service',
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: 'kitchen-group' });
const producer = kafka.producer();

const connectConsumer = async (io) => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('Successfully connected to Kafka');

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
    console.error('Failed to connect to Kafka', error);
  }
};

const publishAlert = async (eventType, key, payload) => {
  try {
    await producer.send({
      topic: 'alerts',
      messages: [{ key, value: JSON.stringify({ type: eventType, data: payload }) }],
    });
  } catch (error) {
    console.error(`Error publishing alert from kitchen-service:`, error);
  }
};

const publishEvent = async (topic, key, payload) => {
  try {
    await producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(payload) }],
    });
  } catch (error) {
    console.error(`Error publishing event to topic ${topic}:`, error);
  }
};

module.exports = { connectConsumer, publishAlert, publishEvent };
