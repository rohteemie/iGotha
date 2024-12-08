#!/usr/bin/env node
/**
 * @file /home/fin/backend/routes/helper/validate.js
 * @description This file contains reusable function.
 */

const { v4: uuidv4, validate: isUuid } = require('uuid');



/**
 * Validates an email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean|string} - Returns `true` if the email is valid, otherwise returns an error message.
 */
function my_email(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format.';
  }
  return true;
}


/**
 * Validates a password based on the following criteria:
 * - At least 8 characters long
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one number
 * - Contains at least one special symbol (@, $, !, %, *, ?, &)
 *
 * @param {string} password - The password to be validated.
 * @returns {boolean|string} - Returns true if the password is valid. Otherwise, returns an error message.
 */
function my_password(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&-_]{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters and include a lowercase letter, uppercase letter, number, and special symbol.';
  }
  return true;
}


/**
 * Validates a UUID string.
 *
 * @param {string} data - The UUID string to validate.
 * @returns {boolean|string} - Returns `true` if valid, or an error message on failure.
 *
 */
function validate_uuid(data) {
	if (!isUuid(data.uuid)) {
	  return 'Invalid UUID format.';
	}
	return;
}



module.exports = { validate_uuid, my_email, my_password };