const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const url = process.env.INFLUXDB_URL || 'http://localhost:8086';
const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG || 'irms_org';
const bucket = process.env.INFLUXDB_BUCKET || 'irms_bucket';

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);
const queryApi = influxDB.getQueryApi(org);

const writeTelemetry = (sensorId, type, value, unit) => {
  const point = new Point('sensor_telemetry')
    .tag('sensor_id', sensorId)
    .tag('type', type)
    .tag('unit', unit)
    .floatField('value', value);

  writeApi.writePoint(point);
  // Optional: Flush immediately, but usually let it batch
  // writeApi.flush();
};

const closeInflux = async () => {
  try {
    await writeApi.close();
    console.log('InfluxDB write API closed');
  } catch (err) {
    console.error('Error closing InfluxDB', err);
  }
};

module.exports = { writeTelemetry, closeInflux, queryApi, bucket };
