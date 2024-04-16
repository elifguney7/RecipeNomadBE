const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = user => {
  return jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1d' });
};

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (inputPassword, savedPassword) => {
  return await bcrypt.compare(inputPassword, savedPassword);
};

module.exports = { generateToken, hashPassword, validatePassword };

