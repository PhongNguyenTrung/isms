const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'ordering-service',
  brokers: brokers
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Successfully connected to Kafka producer');
  } catch (error) {
    console.error('Failed to connect to Kafka', error);
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

module.exports = { connectProducer, publishEvent };
