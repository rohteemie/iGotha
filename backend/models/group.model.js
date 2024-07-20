const { storage } = require('../config/database')
const { DataTypes, Model } = require('sequelize')

/**
 * Represent Group models
 * @typedef {Object} Group
 * @property {string} id - Group identifier
 * @property {string} name - Group name
 * @property {string} [description] - Group description (nullable)
 */

/** @type {Model} */
const Group = storage.define('Group', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Group