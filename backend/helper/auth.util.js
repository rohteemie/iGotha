const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * Hashes a password using bcrypt and returns the hashed password.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 * @throws {Error} If there is an error while hashing the password.
 */
async function hashData(data) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  } catch (err) {
    throw new Error('Error hashing password:', err);
  }
}


/**
 * Compares two passwords in a secure and constant-time manner.
 *
 * @param {string} hashedPassword - The hashed password to compare.
 * @param {string} userPassword - The user's password to compare.
 * @returns {boolean} - Returns true if the passwords match, false otherwise.
 */
async function compareHash(plainData, hashedData) {
  try {
    return await bcrypt.compare(plainData, hashedData);
  } catch (err) {
    throw new Error('Error comparing passwords:', err);
  }
}



/**
 * Generates a JSON Web Token (JWT) for the provided user ID.
 *
 * @param {string} userId - The user ID for which the JWT is generated.
 * @returns {string} The generated JWT.
 */
function generateJWT(sub, username) {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.EXPIRE_IN;

  try {
    return jwt.sign({ sub, username }, secretKey, { expiresIn, algorithm: 'HS256' });
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
}


/**
 * Generates a refresh token (JWT) for the provided user ID.
 * Refresh tokens have a longer expiration time than access tokens.
 *
 * @param {string} sub - The user ID for which the refresh token is generated.
 * @param {string} username - The username associated with the token.
 * @returns {string} The generated refresh token (JWT).
 */
function generateRefreshToken(sub, username) {
  const secretKey = process.env.JWT_SECRET;
  const refreshExpiresIn = process.env.REFRESH_EXPIRE_IN || '7d';

  try {
    return jwt.sign({ sub, username, type: 'refresh' }, secretKey, { expiresIn: refreshExpiresIn, algorithm: 'HS256' });
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw error;
  }
}


/**
 * Verifies the authenticity of a refresh token (JWT).
 * 
 * @param {string} token - The refresh token to be verified.
 * @returns {Object} The decoded token payload containing user information.
 * @throws {Error} If the token is invalid, expired, or not a refresh token.
 */
function verifyRefreshToken(token) {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    console.error('Secret key is missing');
    throw new Error('Internal server error: Missing secret key');
  }

  if (!token) {
    throw new Error('Refresh token not provided');
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    
    if (decodedToken.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return { sub: decodedToken.sub, username: decodedToken.username };
  } catch (err) {
    console.error('Error verifying refresh token:', err.message);
    if (err.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    if (err.message === 'Invalid token type') {
      throw err;
    }
    throw new Error('Invalid refresh token');
  }
}


/**
 * Verifies the authenticity of a JSON Web Token (JWT).
 * @param {string} token - The JWT to be verified.
 */
function verifyToken(token) {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    console.error('Secret key is missing');
    throw new Error('Internal server error: Missing secret key');
  }

  if (!token) {
    throw new Error('Token not provided');
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    return {id: decodedToken.id, username: decodedToken.username};
  } catch (err) {
    console.error('Error verifying token:', err.message);
    throw new Error('Invalid or expired token'); // Throw error instead of returning
  }
}



/**
 * Resets the login count and unlocks the account for users whose account lock duration has expired.
 * @async
 * @function reset_login_count
 * @throws {Error} If an error occurs while resetting the login count.
 * @returns {Promise<void>} A promise that resolves when the login count is reset successfully.
 */
const reset_login_count = async function () {
  try {
    await storage.sync();

    const now = new Date();

    const lockedUsers = await Auth.findAll({
      where: {
        account_locked: true,
        account_locked_date: { [Op.ne]: null }
      }
    });

    for (const user of lockedUsers) {
      const lockedTime = new Date(user.account_locked_time);
      const timeDifference = (now - lockedTime) / 1000 / 60;

      if (timeDifference > 10) {
        await Auth.update({
          failed_login_count: 0,
          account_locked: false,
          account_locked_date: null,
          account_locked_time: null,
        }, {
          where: {
            id: user.id,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error resetting login count:', error);
  }
};


module.exports = {
  hashData,
  generateJWT,
  generateRefreshToken,
  compareHash,
  verifyToken,
  verifyRefreshToken,
  reset_login_count
};
