const { Kafka } = require('kafkajs');
const { writeTelemetry } = require('./influxdb');

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
        const payload = JSON.parse(message.value.toString());
        const { sensorId, type, value, unit } = payload;

        // 1. Write the raw telemetry to InfluxDB
        writeTelemetry(sensorId, type, value, unit);
        // console.log(`Persisted ${type} telemetry for ${sensorId} to InfluxDB: ${value} ${unit}`);

        // 2. Threshold Checking logic
        await checkThresholdsAndAlert(sensorId, type, value, unit);
      },
    });
  } catch (error) {
    console.error('Failed to connect to Kafka in Inventory Service', error);
  }
};

const publishEvent = async (topic, key, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(message) }],
    });
  } catch (error) {
    console.error(`Error publishing event to topic ${topic}`, error);
  }
};

// Extremely basic mocked thresholds for FR10 (Low Stock) and FR11 (Temperature)
const checkThresholdsAndAlert = async (sensorId, type, value, unit) => {
  if (type === 'weight') {
    // If weight falls below 10kg, fire an InventoryLow alert
    if (value < 10 && unit === 'kg') {
      const alertPayload = {
        ingredientId: sensorId,
        level: value,
        unit,
        timestamp: new Date().toISOString()
      };
      await publishEvent('alerts', `alert-low-stock-${sensorId}`, { type: 'InventoryLow', data: alertPayload });
    }
  } else if (type === 'temperature') {
    // If temperature exceeds 6 celsius (e.g. for Walk-in Cooler), fire a TemperatureAlert
    if (value > 6 && unit === 'C') {
      const alertPayload = {
        sensorId,
        temp: value,
        unit,
        location: 'Walk-in Cooler',
        timestamp: new Date().toISOString()
      };
      await publishEvent('alerts', `alert-temp-${sensorId}`, { type: 'TemperatureAlert', data: alertPayload });
    }
  }
};

module.exports = { connectKafka };
