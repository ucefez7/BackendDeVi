const { verifyToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  console.log("working ano mone");
  
  const authHeader = req.header('Authorization');

  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];

  try {
    
    const decoded = verifyToken(token);
    req.admin = decoded.id; 

    console.log("Admin ID extracted from token: " + req.admin);
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
