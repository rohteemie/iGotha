'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  up: async (queryInterface, Sequelize) => {
    // Rename the table from 'Users' to 'users'
    await queryInterface.renameTable('Users', 'users');

    // Rename the columns: createdAt to created_at and updatedAt to updated_at
    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');

    // Add an index to the 'status' column if it doesn't exist already
    await queryInterface.addIndex('users', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the table name back to 'Users'
    await queryInterface.renameTable('users', 'Users');

    // Revert the column names back to createdAt and updatedAt
    await queryInterface.renameColumn('Users', 'created_at', 'createdAt');
    await queryInterface.renameColumn('Users', 'updated_at', 'updatedAt');

    // Remove the index on the 'status' column
    await queryInterface.removeIndex('Users', ['status']);
  },
};
