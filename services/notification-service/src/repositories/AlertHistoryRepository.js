const db = require('../config/db');

class AlertHistoryRepository {
  async saveAlert(type, payload, status = 'PENDING') {
    const query = `
      INSERT INTO alert_history (type, payload, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [type, JSON.stringify(payload), status];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async updateAlertStatus(id, status) {
    const query = `
      UPDATE alert_history
      SET status = $1, resolved_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
  }
}

module.exports = new AlertHistoryRepository();
