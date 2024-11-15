/**
 * This file is responsible for testing the database functionality.
 */
const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({ path });
const { Sequelize } = require("sequelize");


describe('Database Connection', () => {
  let sequelize;

  beforeAll(() => {
    sequelize = new Sequelize(
      process.env.DB_NAME || "test_db",
      process.env.DB_USER || "test_user",
      process.env.DB_PASSWORD || "Test_password1.",
      {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false,
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
