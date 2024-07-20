const { DataTypes, sequelize } = require("sequelize");
const { storage } = require("../config/database");

/**
 * Represent the User model.
 * @typedef {Object} User
 * @property {string} id - represents user identity string.
 * @property {string} username - represents user unique username string.
 * @property {string} email - represents user email.
 * @property {Date} createdAt - represents the date user is added to the system.
 * @property {Date} updatedAt - represents the date user info is last updated.
 */


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
