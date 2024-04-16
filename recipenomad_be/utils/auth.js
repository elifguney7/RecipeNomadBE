const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'your_very_secret_key_here';

const generateToken = user => {
    return jwt.sign({ id: user._id }, secretKey, { expiresIn: '1d' });
};


const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (inputPassword, savedPassword) => {
  return await bcrypt.compare(inputPassword, savedPassword);
};

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length); // Remove 'Bearer ' from string
    }
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  };
  

  
  module.exports = { generateToken, hashPassword, validatePassword, verifyToken };

