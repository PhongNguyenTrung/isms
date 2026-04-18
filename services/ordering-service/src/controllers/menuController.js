const menuRepository = require('../repositories/menuRepository');

const VALID_CATEGORIES = ['MAIN_DISH', 'BEVERAGE', 'APPETIZER', 'DESSERT'];

const getMenu = async (req, res) => {
  try {
    const menuItems = await menuRepository.getAllMenuItems();
    return res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu', error);
    return res.status(500).json({ message: 'Server error retrieving menu' });
  }
};

const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await menuRepository.getMenuItemById(id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    return res.status(200).json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item', error);
    return res.status(500).json({ message: 'Server error retrieving menu item' });
  }
};

const getMenuAdmin = async (req, res) => {
  try {
    const items = await menuRepository.getAllMenuItemsAdmin();
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching admin menu', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const createItem = async (req, res) => {
  try {
    const { name_vi, name_en, description, price, category, is_available, image_url } = req.body;
    if (!name_vi || !name_en || price == null || !category) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: name_vi, name_en, price, category' });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Danh mục không hợp lệ' });
    }
    const item = await menuRepository.createMenuItem({ name_vi, name_en, description, price, category, is_available, image_url });
    return res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item', error);
    return res.status(500).json({ message: 'Server error creating menu item' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_vi, name_en, description, price, category, is_available, image_url } = req.body;
    if (!name_vi || !name_en || price == null || !category) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Danh mục không hợp lệ' });
    }
    const item = await menuRepository.updateMenuItem(id, { name_vi, name_en, description, price, category, is_available, image_url });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.status(200).json(item);
  } catch (error) {
    console.error('Error updating menu item', error);
    return res.status(500).json({ message: 'Server error updating menu item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await menuRepository.deleteMenuItem(id);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
    return res.status(200).json({ message: 'Đã xóa món thành công' });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({ message: 'Không thể xóa: món này đã có trong đơn hàng' });
    }
    console.error('Error deleting menu item', error);
    return res.status(500).json({ message: 'Server error deleting menu item' });
  }
};

module.exports = { getMenu, getMenuItem, getMenuAdmin, createItem, updateItem, deleteItem };
