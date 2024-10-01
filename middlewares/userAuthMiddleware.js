const { verifyToken } = require('../utils/userUtils');
// const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const createHttpError = require('http-errors');

const userAuthMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Extracted Token:', token);  

      // Check if token is blacklisted
      const blacklistedToken = await TokenBlacklist.findOne({ token });
      if (blacklistedToken) {
        throw createHttpError(401, 'Token is blacklisted');
      }

      const decoded = verifyToken(token);
      console.log('Decoded Token:', decoded);
      if (!decoded.id) {
        throw createHttpError(401, 'Token payload is missing required fields');
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        throw createHttpError(404, 'User not found');
      }
      req.user = user;
      next();
    } else {
      throw createHttpError(401, 'Authorization token is missing');
    }
  } catch (error) {
    console.error('Error in Auth Middleware:', error);
    next(error);
  }
};

module.exports = userAuthMiddleware;