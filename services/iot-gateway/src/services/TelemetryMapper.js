class TelemetryMapper {
  /**
   * Transforms an MQTT topic and raw message buffer into a standardized TelemetryEvent.
   * Throws descriptive errors for invalid inputs.
   */
  mapToEvent(topic, messageBuffer) {
    const topicParts = topic.split('/');
    if (topicParts.length !== 3) {
      throw new Error(`Invalid topic format: expected sensors/<id>/<type>, got "${topic}"`);
    }

    const sensorId = topicParts[1];
    const sensorType = topicParts[2]; // 'temperature' or 'weight'

    let payload;
    try {
      payload = JSON.parse(messageBuffer.toString());
    } catch {
      throw new Error(`Invalid JSON payload from sensor ${sensorId}`);
    }

    if (payload.value === undefined || payload.value === null) {
      throw new Error(`Missing "value" field in payload from sensor ${sensorId}`);
    }

    if (!payload.unit) {
      throw new Error(`Missing "unit" field in payload from sensor ${sensorId}`);
    }

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

