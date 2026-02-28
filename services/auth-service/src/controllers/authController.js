const AuthService = require('../services/AuthService');

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = await AuthService.register(username, password, role);
    return res.status(201).json(newUser);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };

