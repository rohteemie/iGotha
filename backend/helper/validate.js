const { v4: uuidv4, validate: isUuid } = require('uuid');


/**
 * Validates user input, including email format and password strength.
 *
 * @param {object} data - The user input data to validate.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's password.
 * @returns {boolean|string} - Returns `true` if validation passes, or an error message on failure.
 *
 */
function validate_input(data) {

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(data.email)) {
    return 'Invalid email format.';
  }


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&-_]{8,}$/;

  if (!passwordRegex.test(data.password)) {
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
	return true;
}



module.exports = { validate_uuid, validate_input };
