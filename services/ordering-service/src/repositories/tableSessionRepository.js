const crypto = require('crypto');
const db = require('../config/db');

const SESSION_TTL_HOURS = 8;

const createSession = async (tableId) => {
  const token = crypto.randomBytes(32).toString('hex'); // 64-char hex, 256-bit entropy
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);

  // Invalidate existing active sessions for this table before creating new one
  await db.query(
    "UPDATE table_sessions SET invalidated_at = NOW() WHERE table_id = $1 AND invalidated_at IS NULL",
    [tableId]
  );

  const result = await db.query(
    'INSERT INTO table_sessions (table_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [tableId, token, expiresAt]
  );
  return result.rows[0];
};

const resolveToken = async (token) => {
  const result = await db.query(
    `SELECT * FROM table_sessions
     WHERE token = $1
       AND invalidated_at IS NULL
       AND expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
};

const invalidateByTableId = async (tableId) => {
  await db.query(
    "UPDATE table_sessions SET invalidated_at = NOW() WHERE table_id = $1 AND invalidated_at IS NULL",
    [tableId]
  );
};

const getActiveTokenByTableId = async (tableId) => {
  const result = await db.query(
    `SELECT token, expires_at FROM table_sessions
     WHERE table_id = $1 AND invalidated_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [tableId]
  );
  return result.rows[0] || null;
};

module.exports = { createSession, resolveToken, invalidateByTableId, getActiveTokenByTableId };
