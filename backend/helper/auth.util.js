const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisUtil = require('../helper/redis.util');

// Configurable account lock duration
const ACCOUNT_LOCK_DURATION_MINUTES = process.env.ACCOUNT_LOCK_DURATION || 10;

async function hashData(data) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  } catch (err) {
    throw new Error('Error hashing data:', err);
  }
}

async function compareHash(plainData, hashedData) {
  try {
    return await bcrypt.compare(plainData, hashedData);
  } catch (err) {
    throw new Error('Error comparing data:', err);
  }
}

function generateJWT(sub, username, role = null) {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.EXPIRE_IN;

  if (!secretKey) {
    throw new Error('JWT secret key is missing');
  }

  try {
    const payload = { sub, username };
    if (role) payload.role = role;
    return jwt.sign(payload, secretKey, { expiresIn, algorithm: 'HS256' });
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
}

function verifyToken(token) {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error('Internal server error: Missing secret key');
  }

  if (!token) {
    throw new Error('Token not provided');
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken;
  } catch (err) {
    console.error('Error verifying token:', err.message);

    if (err.name === 'TokenExpiredError') {
      // throw new Error('Token expired, use refresh token');
      console.log('Token expired, use refresh token');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

const reset_login_count = async function () {
  try {
    await storage.sync();

    const now = new Date();

    const lockedUsers = await Auth.findAll({
      where: {
        account_locked: true,
        account_locked_date: { [Op.ne]: null },
      },
    });

    for (const user of lockedUsers) {
      const lockedTime = new Date(user.account_locked_time);
      const timeDifference = (now - lockedTime) / 1000 / 60;

      if (timeDifference > ACCOUNT_LOCK_DURATION_MINUTES) {
        await Auth.update(
          {
            failed_login_count: 0,
            account_locked: false,
            account_locked_date: null,
            account_locked_time: null,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
      }
    }
  } catch (error) {
    console.error('Error resetting login count:', error);
    throw error;
  }
};

async function addToBlacklist(token, expirySeconds) {
  if (!token || !expirySeconds) {
    throw new Error('Token and expiry time are required');
  }
  await redisUtil.set(`blacklist:${token}`, 'true', expirySeconds);
}

async function isBlacklisted(token) {
  if (!token) {
    throw new Error('Token is required');
  }
  return await redisUtil.get(`blacklist:${token}`);
}

module.exports = {
  hashData,
  generateJWT,
  compareHash,
  verifyToken,
  reset_login_count,
  addToBlacklist,
  isBlacklisted,
};