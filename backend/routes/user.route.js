const express = require('express');
const router = express.Router();
const { registerUser, getUsername } = require('../services/user.service');


/**
 * Represents the result of the login operation.
 * @typedef {Object} LoginResult
 * @property {boolean} success - Indicates whether the login was successful or not.
 * @property {string} message - A message describing the result of the login operation.
 * @property {string} token - The authentication token generated upon successful login.
 */
router.get('/:username', async (req, res) => {
	const { username } = req.params;

	try {
	  const result = await getUsername(username);
	  res.status(result.status).json(result);
	} catch (error) {
	  console.error('Error fetching user:', error);
	  res.status(500).json({ message: 'Internal server error' });
	}
});


/**
 * Represents the result of the registration process.
 * @typedef {Object} RegistrationResult
 * @property {boolean} success - Indicates whether the registration was successful or not.
 * @property {string} message - A message describing the result of the registration.
 */
router.post('/register', async (req, res) => {
  const userDetail = req.body;
  console.log(`Route userDetail: ${userDetail}`);

  try {
    const result = await registerUser(userDetail);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
