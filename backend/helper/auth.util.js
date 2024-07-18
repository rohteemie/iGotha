const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * Hashes a password using bcrypt and returns the hashed password.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 * @throws {Error} If there is an error while hashing the password.
 */
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    throw new Error('Error hashing password:', err);
  }
}


/**
 * Compares two passwords in a secure and constant-time manner.
 *
 * @param {string} hashedPassword - The hashed password to compare.
 * @param {string} userPassword - The user's password to compare.
 * @returns {boolean} - Returns true if the passwords match, false otherwise.
 */
async function comparePassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    throw new Error('Error comparing passwords:', err);
  }
}



/**
 * Generates a JSON Web Token (JWT) for the provided user ID.
 *
 * @param {string} userId - The user ID for which the JWT is generated.
 * @returns {string} The generated JWT.
 * @throws {Error} If an invalid user ID is provided.
 */
function generateJWT(userId) {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.EXPIRE_IN;

  try {
    return jwt.sign({ userId }, secretKey, { expiresIn });
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
}



/**
 * Verifies the authenticity of a JSON Web Token (JWT).
 * @param {string} token - The JWT to be verified.
 * @param {object} res - The response object for error handling.
 */
function verifyToken(token) {
  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    userId = decoded.userId;
    console.log(userId)
  } catch (err) {
    console.error('Error verifying token:', err);
    return { message: 'Invalid token' };
  }
}


module.exports = {
  hashPassword,
  generateJWT,
  comparePassword,
  verifyToken,
  //refreshToken
};