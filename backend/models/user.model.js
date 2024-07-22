const { DataTypes, Model } = require("sequelize");
const { storage } = require("../config/database");

/**
 * Represents User model definition
 * 
 * @typedef {Object} User
 * @property {number} user_id - The unique identifier for the user.
 * @property {string} username - The username of the user.
 * @property {string} [email] - The email of the user (nullable for guest).
 * @property {string} [password] - The password of the user (nullable for guest).
 * @property {('online'|'offline')} status - The status of the user.
 * @property {Date} [last_seen] - The last seen timestamp of the user.
 * @property {Date} created_at - The creation date of the user record.
 * @property {boolean} is_guest - Indicates if the user is a guest.
 */

/** @type {Model} */
const User = storage.define("User", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('online', 'offline'),
    defaultValue: 'offline'
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_guest: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  // Enables automatic timestamps (createdAt & UpdatedAt)
  timestamps: true
});

module.exports = User;
