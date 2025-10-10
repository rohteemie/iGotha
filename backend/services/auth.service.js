const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { User } = require('../models/associations.model');
const {
   compareHash,
   generateJWT,
   generateRefreshToken,
   verifyRefreshToken,
   hashData,
} = require('../helper/auth.util');

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
        return res.status(400).json({ message: 'Email and password are required!' });
    }

    try {
        const user = await Auth.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        if (user.failed_login_count >= 5 && user.account_locked) {
            return res.status(403).json({ message: 'Account is locked. Please try again later.' });
        }

        const passwordMatches = await compareHash(password, user.password);
        if (!passwordMatches) {
            const newFailedLoginCount = user.failed_login_count + 1;
            await Auth.update(
                {
                    failed_login_count: newFailedLoginCount,
                    account_locked: newFailedLoginCount >= 5,
                    account_locked_date: newFailedLoginCount >= 5 ? new Date() : null,
                },
                { where: { email } }
            );
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        const userData = await User.findOne({
            where: { email },
            attributes: ['id', 'first_name', 'username', 'email']
        });

        // Reset failed login count and generate tokens
        const accessToken = generateJWT(sub = userData.id, username = userData.username);
        const refreshToken = generateRefreshToken(sub = userData.id, username = userData.username);
        
        // Hash the refresh token before storing in the database
        const hashedRefreshToken = await hashData(refreshToken);
        
        await Auth.update(
            { failed_login_count: 0, account_locked: false, refresh_token: hashedRefreshToken },
            { where: { email } }
        );

        if (userData) {
            await User.update({ last_seen: new Date() }, { where: { email } });
        }

        return res.status(200).json({ user: userData, accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

async function getAllAuthInfo(req, res) {
    try {
        const authRecords = await Auth.findAll();
        return res.status(200).json(authRecords);
    } catch (error) {
        console.error('Error fetching authentication info:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify the refresh token JWT
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find the user by the decoded user ID
    const userRecord = await User.findOne({ where: { id: decoded.sub } });
    
    if (!userRecord) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    // Get the auth record to verify the stored hashed refresh token
    const authRecord = await Auth.findOne({ where: { email: userRecord.email } });
    
    if (!authRecord || !authRecord.refresh_token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    // Verify the refresh token matches the stored hash
    const { compareHash } = require('../helper/auth.util');
    const isValidToken = await compareHash(refreshToken, authRecord.refresh_token);
    
    if (!isValidToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const newAccessToken = generateJWT(sub = userRecord.id, username = userRecord.username);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error refreshing access token:', error);
    
    if (error.message === 'Refresh token expired') {
      return res.status(401).json({ message: 'Refresh token expired, please log in again' });
    }
    
    if (error.message === 'Invalid refresh token' || error.message === 'Invalid token type') {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
    login,
    getAllAuthInfo,
    refreshAccessToken
};
