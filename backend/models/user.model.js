const { storage } = require('../config/database');
const { DataTypes } = require('sequelize');


/**
 * Represents a user in the system.
 *
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} username - The username of the user. Can be null or empty.
 * @property {string} first_name - The first name of the user. Can be null or empty.
 * @property {string} last_name - The last name of the user. Can be null or empty.
 * @property {string} status - The status of the user, either "online" or "offline". Defaults to "offline".
 * @property {Date} last_seen - The date and time when the user was last seen. Defaults to the current date and time.
 * @property {boolean} is_guest - Indicates whether the user is a guest or not. Defaults to true.
 */

const User = storage.define(
	'User',
	{
	id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
	first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
	last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
    status: {
        type: DataTypes.ENUM('online', 'offline'),
        defaultValue: 'offline'
    },
    last_seen: {
        type: DataTypes.DATE,
        defaultValue: storage.NOW
    },
    is_guest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
	},
);

module.exports = { User };
