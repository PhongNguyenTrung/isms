const express = require('express');
const router = express.Router();
const { queryApi, bucket } = require('../config/influxdb');

/**
 * GET /api/inventory/sensors/:sensorId
 * Returns the last 24h telemetry for a given sensor (FR9)
 */
router.get('/sensors/:sensorId', async (req, res) => {
  const { sensorId } = req.params;
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -24h)
      |> filter(fn: (r) => r._measurement == "sensor_telemetry")
      |> filter(fn: (r) => r.sensor_id == "${sensorId}")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 100)
  `;

  const rows = [];
  try {
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          rows.push(tableMeta.toObject(row));
        },
        error(err) { reject(err); },
        complete() { resolve(); },
      });
    });
    res.json(rows);
  } catch (error) {
    console.error('Error querying InfluxDB', error);
    res.status(500).json({ message: 'Error querying telemetry data' });
  }
});

/**
 * GET /api/inventory/status
 * Returns latest reading per sensor for dashboard overview (FR9, FR10, FR11)
 */
router.get('/status', async (req, res) => {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "sensor_telemetry")
      |> last()
      |> group(columns: ["sensor_id", "type"])
  `;

  const rows = [];
  try {
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          rows.push(tableMeta.toObject(row));
        },
        error(err) { reject(err); },
        complete() { resolve(); },
      });
    });
    res.json(rows);
  } catch (error) {
    console.error('Error querying InfluxDB status', error);
    res.status(500).json({ message: 'Error querying inventory status' });
  }
});

module.exports = router;
