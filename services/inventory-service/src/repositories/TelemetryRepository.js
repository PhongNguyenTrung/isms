const { writeTelemetry } = require('../config/influxdb');

class TelemetryRepository {
  /**
   * Persists raw telemetry data to time-series storage.
   */
  async saveTelemetry(sensorId, type, value, unit) {
    writeTelemetry(sensorId, type, value, unit);
  }
}

module.exports = new TelemetryRepository();
