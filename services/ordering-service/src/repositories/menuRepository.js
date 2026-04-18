const db = require('../config/db');

const getAllMenuItems = async () => {
  const result = await db.query('SELECT * FROM menu_items WHERE is_available = true ORDER BY category, name_vi');
  return result.rows;
};

const getMenuItemById = async (id) => {
  const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getAllMenuItemsAdmin = async () => {
  const result = await db.query('SELECT * FROM menu_items ORDER BY category, name_vi');
  return result.rows;
};

const createMenuItem = async ({ name_vi, name_en, description, price, category, is_available, image_url }) => {
  const result = await db.query(
    `INSERT INTO menu_items (name_vi, name_en, description, price, category, is_available, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name_vi, name_en, description || null, price, category, is_available ?? true, image_url || null]
  );
  return result.rows[0];
};

const updateMenuItem = async (id, { name_vi, name_en, description, price, category, is_available, image_url }) => {
  const result = await db.query(
    `UPDATE menu_items
     SET name_vi=$1, name_en=$2, description=$3, price=$4, category=$5, is_available=$6, image_url=$7
     WHERE id=$8 RETURNING *`,
    [name_vi, name_en, description ?? null, price, category, is_available, image_url ?? null, id]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

const deleteMenuItem = async (id) => {
  const result = await db.query('DELETE FROM menu_items WHERE id=$1 RETURNING id', [id]);
  return result.rows.length > 0;
};

module.exports = { getAllMenuItems, getMenuItemById, getAllMenuItemsAdmin, createMenuItem, updateMenuItem, deleteMenuItem };
