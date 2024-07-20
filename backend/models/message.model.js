const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Represents the Message model
 * @typedef {Object} Message
 * @property {string} id - The unique Identifier of a message
 * @property {string} content - Message content
 * @property {Date} timestamp - Time of message
 * @property {boolean} read_receipt - indicator to indicate message read by recipient
 * @property {boolean} typing_indicator - indicate if message is being typed
 */

/** @type {Model} */
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  read_receipt: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  typing_indicator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Message;
