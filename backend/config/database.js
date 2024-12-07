const path = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({ path }); // Load environment variables based on environment

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
  process.env.DB,                // Database name
  process.env.DB_USER,           // Database username
  process.env.DB_PASSWORD,       // Database password
  {
    host: process.env.DB_HOST,   // Database host
    dialect: process.env.DB_DIALECT || "mysql", // Fallback to MySQL if dialect is not provided
    logging,                     // Log queries only in development
    dialectOptions: {
      // Enable SSL support for production (if required by your DB provider)
      ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : undefined,
    },
    define: {
      timestamps: true,          // Automatically adds `createdAt` and `updatedAt`
      underscored: true,         // Use snake_case column names instead of camelCase
    },
  }
);

// Test database connection and provide feedback
(async () => {
  try {
    await storage.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = { storage, DataTypes };
