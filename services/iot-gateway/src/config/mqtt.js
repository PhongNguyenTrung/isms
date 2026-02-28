const mqtt = require('mqtt');
const { publishEvent } = require('./kafka');

const connectMqtt = () => {
  const brokerUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log(`Successfully connected to MQTT broker: ${brokerUrl}`);

    // Subscribe to all sensor topics
    // Expected format: sensors/<sensorId>/<type> (e.g., sensors/LOC1-TMP1/temperature)
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
      // Parse topic
      const topicParts = topic.split('/');
      if (topicParts.length !== 3) return;

      const sensorId = topicParts[1];
      const sensorType = topicParts[2]; // 'temperature' or 'weight'

      // Parse payload
      const payload = JSON.parse(message.toString());

      // Construct standardized telemetry event
      const telemetryEvent = {
        sensorId,
        type: sensorType,
        value: payload.value,
        unit: payload.unit,
        timestamp: payload.timestamp || new Date().toISOString()
      };

      // Publish to Kafka for InventoryService to consume
      await publishEvent('sensor.telemetry', sensorId, telemetryEvent);
      // console.log(`Forwarded ${sensorType} telemetry for ${sensorId} to Kafka`);

    } catch (err) {
      console.error(`Error processing MQTT message on topic ${topic}:`, err);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT Client Error:', err);
  });
};

module.exports = { connectMqtt };
