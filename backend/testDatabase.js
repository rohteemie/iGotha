const sequelize = require('./config/database'); // Adjust the path as necessary

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close(); // Ensure the connection is closed
  }
}

testConnection();