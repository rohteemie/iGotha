const express = require('express');
const router = express.Router();
const { register, login } = require('../services/auth.service');


/**
 * Represents the result of the login operation.
 * @typedef {Object} LoginResult
 * @property {boolean} success - Indicates whether the login was successful or not.
 * @property {string} message - A message describing the result of the login operation.
 * @property {string} token - The authentication token generated upon successful login.
 */
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
	  const result = await login(email, password);
	  res.status(result.status).json(result);
	} catch (error) {
	  console.error('Error logging in user:', error);
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
  const { email, password } = req.body;

  try {
    const result = await register(email, password);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
