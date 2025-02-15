const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { User } = require('../models/associations.model');
const { compareHash, generateJWT } = require('../helper/auth.util');
const redisUtil = require('../helper/redis.util'); // Redis utility

/**
 * Handles user login by verifying credentials and generating a JWT token.
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

        if (!userData) {
            return res.status(401).json({ message: 'User not found!' });
        }

        // Reset failed login count and generate tokens
        const accessToken = generateJWT({ sub: userData.id, username: userData.username });
        const refreshToken = generateJWT({ sub: userData.email });

        await Auth.update(
            { failed_login_count: 0, account_locked: false, refresh_token: refreshToken },
            { where: { email } }
        );

        if (userData) {
            await User.update({ last_seen: new Date() }, { where: { email } });
        }

        const sessionKey = `user_session:${userData.username}`;
        await redisUtil.set(sessionKey, accessToken, 'EX', 3600); // Store the token with expiry

        return res.status(200).json({ user: userData, accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

/**
 * Refreshes the access token using a valid refresh token.
 */
async function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const authRecord = await Auth.findOne({ where: { refresh_token: refreshToken } });

        if (!authRecord) {
            return res.status(403).json({ message: 'Refresh token no longer valid' });
        }

        const email = authRecord.email;
        const userRecord = await User.findOne({ where: { email } });

        if (!userRecord) {
            return res.status(401).json({ message: 'User not found!' });
        }

        // Remove old access token from Redis before generating a new one
        const sessionKey = `user_session:${userRecord.username}`;
        await redisUtil.del(sessionKey);

        // Generate a new access token
        const newAccessToken = generateJWT({ sub: userRecord.id, username: userRecord.username });

        await redisUtil.set(sessionKey, newAccessToken, 'EX', 3600); // Store new token

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Logs out a user by invalidating the session and refresh token.
 */
async function logout(req, res) {
    try {
        const sessionKey = `user_session:${req.user.username}`;
        await redisUtil.del(sessionKey); // Remove stored access token

        // Invalidate refresh token in the database
        await Auth.update({ refresh_token: null }, { where: { email: req.user.email } });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Retrieves all authentication records.
 */
async function getAllAuthInfo(req, res) {
    try {
        const authRecords = await Auth.findAll();
        return res.status(200).json(authRecords);
    } catch (error) {
        console.error('Error fetching authentication info:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    login,
    getAllAuthInfo,
    refreshAccessToken,
    logout
};
