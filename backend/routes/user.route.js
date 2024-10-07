/**
 * @file /home/fin/backend/routes/user.route.js
 * @description This file contains the routes for user-related operations.
 */


const express = require('express');
const router = express.Router();
const user_service = require('../services/user.service');

 /**
	* @module routes/user
	* @requires express
	* @requires ../services/user.service
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
	* @description Route to update a user by username.
	* @memberof module:routes/user
	* @inner
	* @param {function} user_service.updateUser - Controller function to update a user by username.
	*/

router.get('/', user_service.getAllUsers);
router.post('/create', user_service.registerUser);
router.get('/:username', user_service.getUserName);
router.put('/:username', user_service.updateUser);


module.exports = router;
