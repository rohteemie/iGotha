const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({ path });

const { Sequelize, DataTypes } = require("sequelize");

// Logging configuration (only log queries in development mode)
const logging = process.env.NODE_ENV === "development" ? console.log : false;

// Database configuration
/**
 * Initialize a Sequelize instance to manage the database connection.
 *
 * @type {Sequelize}
 */
const storage = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : undefined,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Test database connection and provide feedback if failed.
(async () => {
  try {
    await storage.authenticate();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();

module.exports = { storage, DataTypes };
