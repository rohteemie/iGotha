const { User } = require('../models/user.model');
const { verifyToken } = require('../helper/auth.util');
const { storage } = require('../config/database');
const randomUser = require('../helper/user.utils');


/**
 * Registers a new user with the provided details.
 *
 * @param {Object} userDetails - User details like username, first_name, last_name, etc.
 * @returns {Promise<Object>} - A promise resolving to an object with a message and status code indicating registration result.
 */
async function registerUser(userDetails) {
  try {
    await storage.sync();

    const userDefaults = {
      status: 'offline',
      last_seen: new Date(),
      is_guest: true,
    };

    const username = userDetails.username || randomUser();

    const user = {
      username,
      first_name: userDetails.first_name || username,
      last_name: userDetails.last_name || '',
      ...userDefaults,
    };


    if (userDetails.email || userDetails.username || userDetails.first_name || userDetails.last_name) {
      user.is_guest = false;
    }

    await User.create(user);

    return {
      message: `${user.is_guest ? 'Guest' : ''} User created successfully`,
      status: 201,
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { message: 'Internal server error', status: 500 };
  }
}

/**
 * Fetches user details using the provided username.
 *
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} - A promise resolving to an object containing the user details or an error message.
 */
async function getUsername(username) {
  try {

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return { message: 'User not found', status: 404 };
    }

    return { user, status: 200 };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { message: 'Error fetching user', status: 403 };
  }
}

module.exports = { registerUser, getUsername };