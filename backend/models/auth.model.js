const { storage, DataTypes } = require('../config/database');

/**
 * Represents the Auth model.
 * @typedef {Object} Auth
 * @property {string} id - The unique identifier for the Auth.
 * @property {string} email - The email address associated with the Auth.
 * @property {string} password - The password associated with the Auth.
 * @property {number} failed_login_count - The number of failed login attempts for the Auth.
 * @property {boolean} account_locked - Indicates if the Auth's account is locked.
 * @property {Date} account_locked_date - The date when the Auth's account was locked.
 * @property {Time} account_locked_time - The time when the Auth's account was locked.
 */

const Auth = storage.define(
  'Auth',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // userId: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // },
    failed_login_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    account_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    account_locked_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
);

module.exports = { Auth };