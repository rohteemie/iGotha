const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { hashPassword, comparePassword, generateJWT } = require('../helper/auth.util');
const { Op } = require('sequelize');

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
        account_locked_time: { [Op.ne]: null }
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
reset_login_count();


/**
 * Authenticates a user by checking their email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to an object containing a message or a token.
 */
async function login(email, password) {
  try {
    await storage.sync();

    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      return { message: 'Invalid email' };
    }

    if (user.failed_login_count >= 5) {
      return { message: 'Account is locked, try again later!' };
    }

    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
      user.failed_login_count += 1;

      if (user.failed_login_count >= 5) {
        user.account_locked = true;
        user.account_locked_date = new Date();
      }

      await user.save();

      if (user.account_locked) {
        return { message: 'Account is locked, wait for 24hrs' };
      }

      return { message: 'Invalid password' };
    }

    if (user.account_locked) {
      return { message: 'Account is locked, try again in 24hrs' };
    }

    const token = generateJWT(user.id);
    return { token };

  } catch (error) {
    return { message: 'Internal server error' };
  }
}

/**
 * Registers a new user with the provided email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing a message indicating the result of the registration process.
 */
async function register(email, password) {
  try {
    await storage.sync();
    const existingUser = await Auth.findOne({ where: { email } });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    const hashedPassword = await hashPassword(password);
    await Auth.create({ email, password: hashedPassword });

    return { message: 'User created successfully' };

  } catch (error) {
    return { message: 'Internal server error' };
  }
}

module.exports = { register, login };
