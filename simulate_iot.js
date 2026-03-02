const mqtt = require('mqtt');

const brokerUrl = 'mqtt://localhost:1883';
console.log(`Connecting to ${brokerUrl}...`);

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker!');

  // Simulate a load-cell (weight) sensor
  const weightTopic = 'sensors/LOC1-WGT1/weight';
  const weightData = {
    value: 8.5, // Below 10kg threshold
    unit: 'kg',
    timestamp: new Date().toISOString()
  };

  client.publish(weightTopic, JSON.stringify(weightData), () => {
    console.log(`Published to ${weightTopic}:`, weightData);
  });

  // Simulate a temperature sensor
  const tempTopic = 'sensors/LOC1-TMP1/temperature';
  const tempData = {
    value: 8.2, // Above 6C threshold
    unit: 'C',
    timestamp: new Date().toISOString()
  };

  setTimeout(() => {
    client.publish(tempTopic, JSON.stringify(tempData), () => {
      console.log(`Published to ${tempTopic}:`, tempData);

      console.log('Finished simulating. To observe the results, check: docker logs irms-inventory');
      client.end();
    });
  }, 1000); // 1s delay
});

client.on('error', (err) => {
  console.error('MQTT Client Error:', err);
  process.exit(1);
});
