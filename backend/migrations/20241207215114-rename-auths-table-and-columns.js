'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Rename the table from 'Users' to 'users'
    await queryInterface.renameTable('Auths', 'auths');

    // Rename the columns: createdAt to created_at and updatedAt to updated_at
    await queryInterface.renameColumn('auths', 'createdAt', 'created_at');
    await queryInterface.renameColumn('auths', 'updatedAt', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Revert the table name back to 'Users'
    await queryInterface.renameTable('auths', 'Auths');

    // Revert the column names back to createdAt and updatedAt
    await queryInterface.renameColumn('Auths', 'created_at', 'createdAt');
    await queryInterface.renameColumn('Auths', 'updated_at', 'updatedAt');
  }
};
