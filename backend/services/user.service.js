const { Auth } = require('../models/auth.model');
const { User } = require('../models/associations.model');
const { verifyToken, hashData } = require('../helper/auth.util');
const randomUser = require('../helper/user.util');
const { redis_client } = require('../config/redis.config');
const { Op } = require('sequelize');

async function doesUserExist(email, username) {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });
  const auth = await Auth.findOne({
    where: {
      [Op.or]: [{ email }],
    },
  });
  return user || auth || null;
}

async function registerUser(req, res) {
  const userDetails = req.body;

  try {
    const userType = randomUser();

    if (Object.keys(userDetails).length === 0) {
      const guestUser = {
        username: userType,
        first_name: userType,
        last_name: userType,
        is_guest: true,
        email: null,
      };

      const guest_user = await User.create(guestUser);
      return res.status(201).json({
        message: 'Guest User created successfully',
        user: guest_user.toJSON(),
       });
    }

    // Check for required fields
    const requiredFields = ['email', 'password', 'username', 'first_name', 'last_name'];
    const missingFields = requiredFields.filter((field) => !userDetails[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    if (await doesUserExist(userDetails.email, userDetails.username)) {
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


async function getUsername(req, res) {
  const { username } = req.params;

  try {
    // Check cache
    const cachedUser = await new Promise((resolve, reject) => {
      redis_client.get(username, (err, data) => {
        if (err) reject(err);
        resolve(data ? JSON.parse(data) : null);
      });
    });

    if (cachedUser) {
      return res.status(200).json(cachedUser);
    }

    const userDetails = await User.findOne({ where: { username } });
    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    const authDetails = await Auth.findOne({ where: { email: userDetails.email } });
    if (!authDetails) {
      return res.status(404).json({ message: 'Auth details not found' });
    }

    // Cache result
    const userDataToCache = { ...userDetails.toJSON(), auth: authDetails.toJSON() };
    redis_client.setex(username, 3600, JSON.stringify(userDataToCache)); // Cache for 1 hour

    return res.status(200).json(userDataToCache);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllUsers(req, res) {
  try {
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
    const getUserId = verifyToken(req.headers['authorization']);
    if (!getUserId) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const authInfo = await Auth.findOne({ where: { email: user.email } });
    if (!authInfo) {
      return res.status(404).json({ message: 'Auth details not found' });
    }

    if (getUserId !== authInfo.id) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }

    // Validate updatedData to ensure key fields are not left out
    const requiredFields = ['first_name', 'last_name', 'email', 'username'];
    const missingFields = requiredFields.filter((field) => !updatedData[field] && !user[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
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
  getUsername,
  getAllUsers,
  updateUser,
};
