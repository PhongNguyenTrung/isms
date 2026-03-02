const db = require('../config/db');

const getAllMenuItems = async () => {
  const result = await db.query('SELECT * FROM menu_items WHERE is_available = true');
  return result.rows;
};

const getMenuItemById = async (id) => {
  const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

module.exports = {
  getAllMenuItems,
  getMenuItemById
};
