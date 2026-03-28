const db = require('../config/db');

const findByUsername = async (username) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createUser = async (username, hashedPassword, role) => {
  const result = await db.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
    [username, hashedPassword, role]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query('SELECT id, username, role FROM users WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = {
  findByUsername,
  findById,
  createUser
};
