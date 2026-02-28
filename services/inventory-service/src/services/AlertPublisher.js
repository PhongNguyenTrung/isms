const { producer } = require('../config/kafka');

class AlertPublisher {
  async publishAlert(eventType, key, payload) {
    try {
      await producer.send({
        topic: 'alerts',
        messages: [{ key, value: JSON.stringify({ type: eventType, data: payload }) }],
      });
    } catch (error) {
      console.error(`Error publishing alert to topic alerts`, error);
    }
  }
}

module.exports = new AlertPublisher();
