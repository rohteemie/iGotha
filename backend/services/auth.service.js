const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const {
   hashPassword,
   comparePassword,
   generateJWT,
   reset_login_count
  } = require('../helper/auth.util');
const schedule = require('node-schedule');


/**
 * Schedule reset_login_count to run periodically every minutes.
 * This ensures locked accounts are unlocked after the lock duration.
 */
const unlockJob = schedule.scheduleJob('* * * * *', reset_login_count);


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
      console.log({ message: 'Invalid email, None registerd user!'})
      return { message: 'Invalid email', status: 401 };
    }

    if (user.failed_login_count >= 5) {
      console.log({ message: 'Account is locked, try again later!' })
      return { message: 'Account is locked, try again later!', status: 403 };
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
        console.log({message: 'Account is locked, wait for 24hrs'})
        return { message: 'Account is locked, wait for 24hrs', status: 403 };
      }

      console.log({ message: 'Invalid password' })
      return { message: 'Invalid password', status: 401 };
    }

    if (user.account_locked) {
      console.log({ message: 'Account is locked, try again in 24hrs' })
      return { message: 'Account is locked, try again in 24hrs', status: 401 };
    }

    const token = generateJWT(user.id);
    console.log({token})
    return { token, status: 200 };

  } catch (error) {
    console.error('Error during login:', error);
    return { message: 'Internal server error', status: 500 };
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
      return { message: 'User already exists', status: 400 };
    }

    const hashedPassword = await hashPassword(password);
    await Auth.create({ email, password: hashedPassword });

    return { message: 'User created successfully', status: 201 };
  } catch (error) {
    console.error('Error creating user:', error);
    return { message: 'Internal server error', status: 500 };
  }
}

module.exports = { register, login };