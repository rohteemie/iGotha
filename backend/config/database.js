// Load environment variables before Sequelize initialization
require('dotenv').config();

const { Sequelize } = require('sequelize');

// Database configuration using environment variables
const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
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
