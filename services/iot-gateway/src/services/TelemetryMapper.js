class TelemetryMapper {
  /**
   * Transforms an MQTT topic and raw message buffer into a standardized TelemetryEvent
   */
  mapToEvent(topic, messageBuffer) {
    const topicParts = topic.split('/');
    if (topicParts.length !== 3) {
      throw new Error(`Invalid topic format: ${topic}`);
    }

    const sensorId = topicParts[1];
    const sensorType = topicParts[2]; // 'temperature' or 'weight'

    const payload = JSON.parse(messageBuffer.toString());

    return {
      sensorId,
      type: sensorType,
      value: payload.value,
      unit: payload.unit,
      timestamp: payload.timestamp || new Date().toISOString()
    };
  }
}

module.exports = new TelemetryMapper();
