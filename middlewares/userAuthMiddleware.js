const { verifyToken } = require('../utils/userUtils');

const userAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded.id; // Attach the decoded user ID to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = userAuthMiddleware;
