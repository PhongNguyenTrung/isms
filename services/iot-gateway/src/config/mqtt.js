const mqtt = require('mqtt');
const { publishEvent } = require('./kafka');
const TelemetryMapper = require('../services/TelemetryMapper');

const connectMqtt = () => {
  const brokerUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log(`Successfully connected to MQTT broker: ${brokerUrl}`);

    // Subscribe to all sensor topics
    client.subscribe('sensors/+/+', (err) => {
      if (err) {
        console.error('Failed to subscribe to sensor topics', err);
      } else {
        console.log('Subscribed to pattern: sensors/+/+');
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const telemetryEvent = TelemetryMapper.mapToEvent(topic, message);

      // Publish to Kafka for InventoryService to consume
      await publishEvent('sensor.telemetry', telemetryEvent.sensorId, telemetryEvent);

    } catch (err) {
      console.error(`Error processing MQTT message on topic ${topic}:`, err);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT Client Error:', err);
  });
};

module.exports = { connectMqtt };
