const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  /**
   * Registers a new user. Throws an error with statusCode if validation fails.
   */
  async register(username, password, role) {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = role || 'CUSTOMER';

    return await userRepository.createUser(username, hashedPassword, userRole);
  }

  /**
   * Authenticates a user and returns a JWT token + user profile.
   * Throws an error with statusCode if credentials are invalid.
   */
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: { id: user.id, username: user.username, role: user.role }
    };
  }
}

module.exports = new AuthService();
