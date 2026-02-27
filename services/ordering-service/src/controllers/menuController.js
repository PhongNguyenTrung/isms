const menuRepository = require('../repositories/menuRepository');

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

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    return res.status(200).json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item', error);
    return res.status(500).json({ message: 'Server error retrieving menu item' });
  }
};

module.exports = { getMenu, getMenuItem };
