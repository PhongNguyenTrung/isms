const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'ordering-service',
  brokers: brokers
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'ordering-ready-group' });

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Successfully connected to Kafka producer');
  } catch (error) {
    console.error('Failed to connect to Kafka', error);
  }
};

const connectConsumer = async () => {
  // Lazy require to avoid circular dependency
  const orderRepository = require('../repositories/orderRepository');
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'kitchen_ready', fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const { orderId } = JSON.parse(message.value.toString());
          await orderRepository.updateOrderStatus(orderId, 'READY');
          console.log(`[ordering] Order ${orderId} marked READY`);
        } catch (err) {
          console.error('[ordering] Error processing kitchen_ready:', err);
        }
      },
    });
  } catch (error) {
    console.error('Failed to connect Kafka consumer', error);
  }
};

const publishEvent = async (topic, key, message) => {
  try {
    await producer.send({
      topic,
      messages: [
        { key, value: JSON.stringify(message) }
      ],
    });
    console.log(`Event published to topic ${topic}`);
  } catch (error) {
    console.error(`Error publishing event to topic ${topic}`, error);
  }
};

module.exports = { connectProducer, connectConsumer, publishEvent };
