const { Auth } = require('../models/auth.model');

const { User } = require('../models/associations.model');
const { verifyToken, hashData } = require('../helper/auth.util');
const randomUser = require('../helper/user.util');

async function doesUserExist(email) {
  const userExist = await User.findOne({ where: { email } });
  const authExist = await Auth.findOne({ where: { email } });
  return userExist || authExist || null;
}

async function registerUser(req, res) {
  console.log('Request Body:', req.body);
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

async function getUserName(req, res) {
  const { username } = req.params;

  try {
    const userDetails = await User.findOne({ where: { username } });
    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    const authDetails = await Auth.findOne({ where: { email: userDetails.email } });
    if (!authDetails) {
      return res.status(404).json({ message: 'Auth details not found' });
    }

    // const auth = verifyToken(req.headers['authorization']);
    // console.log('Auth:', auth);
    // if (!auth) {
    //   return res.status(401).json({ message: 'Unauthorized request' });
    // }

    // if (auth === authDetails.id) {
    //   return res.status(200).json(userDetails);
    // } else {
    //   return res.status(401).json({ message: 'Invalid token' });
    // }

    return res.status(200).json(userDetails);

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
    if (getUserId === authInfo.id) {
      await User.update(updatedData, { where: { username } });
      return res.status(200).json({ message: 'User updated successfully' });
    } else {
      return res.status(401).json({ message: 'Unauthorized request' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  registerUser,
  getUserName,
  getAllUsers,
  updateUser,
};
