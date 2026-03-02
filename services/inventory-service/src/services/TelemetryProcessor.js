const TelemetryRepository = require('../repositories/TelemetryRepository');
const AlertPublisher = require('./AlertPublisher');

class TelemetryProcessor {
  /**
   * Process incoming telemetry: persist it and check for threshold breaches.
   */
  async processTelemetry(sensorId, type, value, unit) {
    // 1. Persist data
    await TelemetryRepository.saveTelemetry(sensorId, type, value, unit);

    // 2. Evaluate thresholds and trigger alerts
    await this._evaluateThresholds(sensorId, type, value, unit);
  }

  async _evaluateThresholds(sensorId, type, value, unit) {
    if (type === 'weight' && value < 10 && unit === 'kg') {
      const payload = {
        ingredientId: sensorId,
        level: value,
        unit,
        timestamp: new Date().toISOString()
      };
      return await AlertPublisher.publishAlert('InventoryLow', `alert-low-stock-${sensorId}`, payload);
    }

    if (type === 'temperature' && value > 6 && unit === 'C') {
      const payload = {
        sensorId,
        temp: value,
        unit,
        location: 'Walk-in Cooler',
        timestamp: new Date().toISOString()
      };
      return await AlertPublisher.publishAlert('TemperatureAlert', `alert-temp-${sensorId}`, payload);
    }
  }
}

module.exports = new TelemetryProcessor();
