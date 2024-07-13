const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { hashPassword, secureCompare, generateJWT} = require('../helper');
const { Op } = require('sequelize');


/**
 * Resets the login count and unlocks the account for users whose account lock duration has expired.
 * @async
 * @function reset_login_count
 * @throws {Error} If an error occurs while resetting the login count.
 * @returns {Promise<void>} A promise that resolves when the login count is reset successfully.
 */
const now = new Date();
const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const reset_login_count = async function () {
  try {
    await storage.sync();
    await Auth.findAll()
    const users = await Auth.findAll();
    if (users.length === 0) {
      return;
    }

    await Auth.update({
      failed_login_count: 0,
      account_locked: false,
      account_locked_date: null,
      account_locked_time: null,
    }, {
      where: {
        account_locked_date: { [Op.lt]: new Date() },
        account_locked_time: { [Op.lt]: formattedTime },
      },
    });
  } catch (error) {
    console.error('Error resetting login count:', error);
    // Consider returning an error object for better handling
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
    const hashedPassword = await hashPassword(password);
    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      return { message: 'Invalid email' };
    }

    const passwordMatches = await secureCompare(hashedPassword, user.password);

    if (!passwordMatches) {
      await Auth.update({
        failed_login_count: Sequelize.col('failed_login_count') + 1,
        account_locked: Sequelize.literal('failed_login_count > 5'),
        account_locked_date: new Date(),
        account_locked_time: new Date().getTime(),
      }, {
        where: { email },
      });

      if (user.failed_login_count > 5) {
        return { message: 'Account is locked, wait for 24hrs' };
      } else {
        return { message: 'Invalid password' };
      }
    }

    const token = generateJWT(user.id);

    if (user.account_locked) {
      return { message: 'Account is locked, try again in 24hrs' };
    } else {
      return { token };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { message: 'Internal server error' };
  }
}



/**
 * Registers a new user with the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing a message indicating the result of the registration process.
 */
async function register(email, password) {
  try {
    await storage.sync();
    const hashedPassword = await hashPassword(password);

    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser) {
      console.log({ message: 'User already exists' })
      return { message: 'User already exists' };
    }

    await Auth.create({ email, password: hashedPassword });
    console.log('User created successfully');
    return { message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { message: 'Internal server error' };
  }
}


module.exports = register, login;