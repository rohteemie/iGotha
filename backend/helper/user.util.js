#!/usr/bin/env node
/**
 * Generates a random username.
 *
 * @returns {string} The generated username.
 */
function randomUser() {
	const randomNumber = Math.floor(Math.random() * 1000) + 1;
	const username = `user_${randomNumber}`;
	return username;
  }

module.exports = randomUser;