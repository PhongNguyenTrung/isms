const { Kafka } = require('kafkajs');
const AlertDispatcher = require('../services/AlertDispatcher');

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const connectKafka = async () => {
  try {
    await consumer.connect();
    console.log('Successfully connected to Kafka for Notification Service');

    // Subscribe to the unified alerts topic
    await consumer.subscribe({ topic: 'alerts', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          const { type, data } = payload;

          await AlertDispatcher.processAlert(type, data);
        } catch (err) {
          console.error('Error processing alert message:', err);
        }
      },
    });
  } catch (error) {
    console.error('Failed to connect to Kafka in Notification Service', error);
  }
};

module.exports = { connectKafka };
