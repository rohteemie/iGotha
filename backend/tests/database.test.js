/**
 * This file is responsible for testing the database functionality.
 */
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config();


describe('Database Connection', () => {
  let sequelize;

  beforeAll(() => {
    sequelize = new Sequelize(
      'test_database',
      'test_user',
      'Test_password1.',
      {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
      }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('should establish a connection successfully', async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection established successfully!');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  });
});
