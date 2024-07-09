require('dotenv').config();

const { Sequelize } = require('sequelize');

// Database configuration using environment variables
/**
 * Sequelize instance for connecting to the database.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false
  }
);

module.exports = sequelize;
