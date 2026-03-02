const { Kafka } = require('kafkajs');
const TelemetryProcessor = require('../services/TelemetryProcessor');

const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: brokers
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });
const producer = kafka.producer();

const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('Successfully connected to Kafka for Inventory Service');

    await consumer.subscribe({ topic: 'sensor.telemetry', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          const { sensorId, type, value, unit } = payload;

          await TelemetryProcessor.processTelemetry(sensorId, type, value, unit);
        } catch (err) {
          console.error('Error processing telemetry message:', err);
        }
      },
    });
  } catch (error) {
    console.error('Failed to connect to Kafka in Inventory Service', error);
  }
};

module.exports = { connectKafka, producer };
