/**
 * This file is responsible for testing the database functionality.
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();


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
      await sequelize.authenticate();
  });
});
