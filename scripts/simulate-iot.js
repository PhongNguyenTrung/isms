/**
 * simulate_iot.js — Demo script for IoT sensor simulation.
 *
 * Publishes sensor payloads to MQTT broker to trigger the full pipeline:
 *   MQTT → iot-gateway → Kafka (sensor.telemetry) → inventory-service → Kafka (alerts) → notification-service
 *
 * Usage:
 *   node simulate_iot.js               # run once
 *   node simulate_iot.js --continuous  # loop every 5 seconds
 */
const mqtt = require('mqtt');

const brokerUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const continuous = process.argv.includes('--continuous');

console.log(`Connecting to ${brokerUrl}...`);

const client = mqtt.connect(brokerUrl);

const SCENARIOS = [
  {
    topic: 'sensors/LOC1-WGT1/weight',
    payload: { value: 8.5, unit: 'kg' },
    label: 'Low stock alert (< 10kg)'
  },
  {
    topic: 'sensors/LOC1-TMP1/temperature',
    payload: { value: 8.2, unit: 'C' },
    label: 'Temperature alert (> 6°C)'
  },
  {
    topic: 'sensors/LOC2-WGT1/weight',
    payload: { value: 25.0, unit: 'kg' },
    label: 'Normal stock level'
  },
  {
    topic: 'sensors/LOC2-TMP1/temperature',
    payload: { value: 4.0, unit: 'C' },
    label: 'Normal temperature'
  },
];

function publishAll() {
  SCENARIOS.forEach((s, idx) => {
    setTimeout(() => {
      const payload = { ...s.payload, timestamp: new Date().toISOString() };
      client.publish(s.topic, JSON.stringify(payload), () => {
        console.log(`[${s.label}] → ${s.topic}:`, payload);
      });
    }, idx * 500);
  });
}

client.on('connect', () => {
  console.log('Connected to MQTT broker!');
  publishAll();

  if (continuous) {
    console.log('Running in continuous mode (every 5s). Press Ctrl+C to stop.');
    setInterval(publishAll, 5000);
  } else {
    setTimeout(() => {
      console.log('\nSimulation complete. Check logs: docker logs irms-inventory-service-1');
      client.end();
    }, SCENARIOS.length * 500 + 1000);
  }
});

client.on('error', (err) => {
  console.error('MQTT Client Error:', err);
  process.exit(1);
});
