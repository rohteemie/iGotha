const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { User } = require('../models/associations.model');
const {
   compareHash,
   generateJWT,
} = require('../helper/auth.util');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

/**
 * Handles user login by verifying credentials and generating a JWT token.
 *
 * @async
 * @function login
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user attempting to log in.
 * @param {string} req.body.password - The password of the user attempting to log in.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Returns a JSON response with user data and access token if successful, or an error message if not.
 *
 * @throws {Error} - Throws an error if there is an issue during the login process.
 */
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'No email or password given!'})
    }

    try {
        await storage.sync();

        const user = await Auth.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Wrong email' });
        }

        if (user.failed_login_count >= 5 && user.account_locked) {
            return res.status(403).json({ message: 'Account is locked, try again later!' });
        }

        const passwordMatches = await compareHash(password, user.password);
        if (!passwordMatches) {
            const newFailedLoginCount = user.failed_login_count + 1;

            await Auth.update({
                failed_login_count: newFailedLoginCount,
                account_locked: newFailedLoginCount >= 5 ? true : user.account_locked,
                account_locked_date: newFailedLoginCount >= 5 ? new Date() : user.account_locked_date,
            }, {
                where: { email: user.email }
            });
            return res.status(401).json({ message: 'Wrong password' });
        }

        const accessToken = generateJWT(user.id);
        const refreshToken = uuidv4();
        const userData = await User.findOne({ where: { email } });

        if (userData) {
            await Auth.update({
                failed_login_count: 0,
                account_locked: false,
                account_locked_date: null,
                refresh_token: refreshToken,
            }, {
                where: { email: user.email }
            });
        }

        await User.update({
            last_seen: new Date()
        }, {
            where: { username: userData.username }
        });

        return res.status(200).json({ userData, accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


async function getAllAuthInfo(req, res) {
    try {
        await storage.sync();

        const authInfo = await Auth.findAll();

        return res.status(200).json(authInfo);
    } catch (error) {
        console.error('Error fetching authentication info:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    // Find the user with the provided refresh token
    const user = await Auth.findOne({ where: { refresh_token: refreshToken } });

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const newAccessToken = generateJWT(user.id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
    login,
    getAllAuthInfo,
    refreshAccessToken
};