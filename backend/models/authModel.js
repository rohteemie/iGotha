const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Auth = sequelize.define('Authentication', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Enforce unique email addresses
  },
  password: {
    type: DataTypes.VIRTUAL, // Don't store password in the database
    set(value) {
      // Hash the password using a strong algorithm
      this.hashedPassword = hashPassword(value);
    },
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

function hashPassword(password) {
  // Implement a strong password hashing algorithm here
  // (e.g., bcrypt.hashSync, argon2.hash)
}

module.exports = Auth;
