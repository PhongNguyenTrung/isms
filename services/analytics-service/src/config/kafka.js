const { Kafka } = require('kafkajs');
const MetricsAggregator = require('../services/MetricsAggregator');

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

const connectKafka = async () => {
  try {
    await consumer.connect();
    console.log('Successfully connected to Kafka for Analytics Service');

    // Subscribe to topics we want to track
    await consumer.subscribe({ topic: 'orders', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());

          if (topic === 'orders') {
            await MetricsAggregator.processOrderPlaced(payload);
          }
        } catch (err) {
          console.error('Error processing message in Analytics:', err);
        }
      },
    });
  } catch (error) {
    console.error('Failed to connect to Kafka in Analytics Service', error);
  }
};

module.exports = { connectKafka };
