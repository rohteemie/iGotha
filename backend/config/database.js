// Load environment variables before Sequelize initialization
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Database configuration using environment variables
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    logging: false,
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection established successfully!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
