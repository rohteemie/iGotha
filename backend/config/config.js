require('dotenv').config(); // Load environment variables from .env

module.exports = {
  development: {
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'Test_password1.',
    database: process.env.DB || 'test_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  test: {
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'Test_password1.',
    database: process.env.DB || 'test_database',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
