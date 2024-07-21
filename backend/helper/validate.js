const { v4: uuidv4, validate: isUuid } = require('uuid');



function validate_email(email) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format.';
  }
  return true;
}


function validate_password(password) {
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
	return true;
}



module.exports = { validate_uuid, validate_email, validate_password };
