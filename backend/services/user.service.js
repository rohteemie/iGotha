const { User } = require('../models/user.model');
const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const { verifyToken } = require('../helper/auth.util');
const { hashData } = require('../helper/auth.util');
const randomUser = require('../helper/user.util');

async function doesUserExist(email) {
  const userExist = await User.findOne({ where: { email } });
  const authExist = await Auth.findOne({ where: { email } });
  return userExist || authExist;
}

/**
 * Registers a new user with the provided details.
 *
 * @param {Object} userDetails - User details like username, first_name, last_name, etc.
 * @returns {Promise<Object>} - A promise resolving to an object with a message and status code indicating registration result.
 */
/**
 * Registers a new user or a guest user based on the request body.
 *
 * @async
/**
 * Registers a new user or a guest user based on the request body.
 *
 * @async
*/

async function registerUser(req, res) {
  console.log('Request Body:', req.body);
  const userDetails = req.body;

  try {
    await storage.sync();

    const userType = randomUser();

    if (Object.keys(userDetails).length === 0) {
      const guestUser = {
        username: userType,
        first_name: userType,
        last_name: userType,
        is_guest: true,
        email: null
      };

      await User.create(guestUser);
      return res.status(201).json({ message: 'Guest User created successfully' });
    }

    if (!userDetails.email || !userDetails.password) {
      return res.status(400).json({ message: 'Email or Password is missing' });
    }

    if (await doesUserExist(userDetails.email)) {
      return res.status(403).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashData(userDetails.password);
    await Auth.create({ email: userDetails.email, password: hashedPassword });

    const { password, ...userWithoutPassword } = userDetails;
    await User.create(userWithoutPassword);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}



/**
 * Fetches user details using the provided username.
 *
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} - A promise resolving to an object containing the user details or an error message.
 */
async function getUserName(req, res) {
  const { username } = req.params;

  try {
    const userDetails = await User.findOne({ where: { username } });
    const authDetails = await Auth.findOne({ where: { email: userDetails.email } });
    const auth = verifyToken(req.headers['authorization']);

    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    if (!await doesUserExist(userDetails.email)) {
      return res.status(404).json({ message: 'Register User not found' });
    }

    if (auth === authDetails.id) {
      res.status(200).json(userDetails);
    } else {
      res.status(401).json(auth);
    }

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



async function getAllUsers(req, res) {
  try {
      await storage.sync();

      const users = await User.findAll();

      return res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching all users:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}



async function updateUser(req, res) {
  const { username } = req.params;
  const updatedData = req.body;

  try {
      await storage.sync();

      const user = await User.findOne({ where: { username } });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      await User.update(updatedData, { where: { username } });

      return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports = {
  registerUser,
  getUserName,
  getAllUsers,
  updateUser
};