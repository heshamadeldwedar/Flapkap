'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add role_id column to users table
    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    });

    // Add index
    await queryInterface.addIndex('users', ['role_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role_id');
  }
};