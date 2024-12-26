#!/usr/bin/env node
/**
 * @file /home/fin/backend/routes/user.route.js
 * @description This file contains the routes for user-related operations.
 */

const express = require('express');
const router = express.Router();
const user_service = require('../services/user.service');
const rateLimit = require('express-rate-limit');
const validate = require('../helper/validate');
const { authenticateToken } = require('../middleware/auth.middleware');


/**
 * @module routes/user
 * @requires express
 * @requires ../services/user.service
 * @requires express-rate-limit
 * @requires ../helper/validate
 */

 /**
	* @name /
	* @function
	* @description Route to get all users.
	* @memberof module:routes/user
	* @inner
	* @param {function} user_service.getAllUsers - Controller function to get all users.
	*/

 /**
	* @name /create
	* @function
	* @description Route to create a new user.
	* @memberof module:routes/user
	* @inner
	* @param {function} user_service.registerUser - Controller function to register a new user.
	*/

 /**
	* @name /:username
	* @function
	* @description Route to get a user by username.
	* @memberof module:routes/user
	* @inner
	* @param {function} user_service.getUserName - Controller function to get a user by username.
	*/

 /**
	* @name /:username
	* @function
	* @description  Route to update a user by username.
	* @memberof module:routes/user
	* @inner
	* @param {function} user_service.updateUser - Controller function to update a user by username.
	*/


// Rate limiting middleware for the create user route
const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many accounts created from this IP, please try again after 15 minutes'
});

/**
 * @name /
 * @function
 * @description Route to get all users.
 * @memberof module:routes/user
 * @inner
 * @param {function} user_service.getAllUsers - Controller function to get all users.
 */
router.get('/', user_service.getAllUsers);

/**
 * @name /create
 * @function
 * @description Route to create a new user with validation and rate limiting.
 * @memberof module:routes/user
 * @inner
 * @param {function} user_service.registerUser - Controller function to register a new user.
 */
router.post('/create', createAccountLimiter, (req, res) => {
  const { email, password } = req.body;

  const emailValidation = validate.my_email(email);
  if (emailValidation !== true) {
    return res.status(400).json({ message: emailValidation });
  }

  const passwordValidation = validate.my_password(password);
  if (passwordValidation !== true) {
    return res.status(400).json({ message: passwordValidation });
  }


  user_service.registerUser(req, res);
});

/**
 * @name /:username
 * @function
 * @description Route to get a user by username.
 * @memberof module:routes/user
 * @inner
 * @param {function} user_service.getUserName - Controller function to get a user by username.
 */
router.get('/:username', authenticateToken, user_service.getUserName);

/**
 * @name /:username
 * @function
 * @description Route to update a user by username.
 * @memberof module:routes/user
 * @inner
 * @param {function} user_service.updateUser - Controller function to update a user by username.
 */
router.put('/:username', authenticateToken, user_service.updateUser);


module.exports = router;
