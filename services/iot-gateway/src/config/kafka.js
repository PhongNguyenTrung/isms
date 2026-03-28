const { Kafka, Partitioners } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'iot-gateway',
  brokers: brokers
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Successfully connected to Kafka producer for IoT Gateway');
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
  } catch (error) {
    console.error(`Error publishing event to topic ${topic}`, error);
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
  } catch (err) {
    console.error('Error disconnecting Kafka producer', err);
  }
};

module.exports = { connectProducer, publishEvent, disconnectProducer };
