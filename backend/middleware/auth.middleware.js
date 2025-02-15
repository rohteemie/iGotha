const { verifyToken } = require('../helper/auth.util');
const redisUtil = require('../helper/redis.util');
const requestIp = require('request-ip');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token not provided or malformed' });
    }
    const token = authHeader.split(' ')[1];

    const decodedUser = verifyToken(token);
    console.log(decodedUser.sub);
    if (!decodedUser || typeof decodedUser !== 'object' || !decodedUser.sub.username || !decodedUser.sub) {
      return res.status(403).json({ message: 'Invalid token payload' });
    }

    const sessionKey = `user_session:${decodedUser.sub.username}`;
    const storedToken = await redisUtil.get(sessionKey);

    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ message: 'Session invalidated. Please log in again.' });
    }

    req.user = {
      id: decodedUser.sub,
      username: decodedUser.sub.username,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error); // Log the error for debugging

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, use refresh token' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    } else if (error.name === 'NotBeforeError') {
      return res.status(403).json({ message: 'Token not yet valid' });
    }

    // Handle unexpected errors
    return res.status(500).json({ message: 'Internal server error' });
  }
}

function validateUserOwnership(req, res, next) {
  const { username } = req.params;
  if (req.user.username !== username) {
    return res.status(403).json({ message: 'You do not have access to this resource' });
  }
  next();
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
}

const allowedIPs = ['123.456.789.000'];
function checkIP(req, res, next) {
  const userIP = requestIp.getClientIp(req);
  if (!allowedIPs.includes(userIP)) {
    return res.status(403).json({ message: 'Unauthorized IP address' });
  }
  next();
}

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkIP,
  validateUserOwnership,
};