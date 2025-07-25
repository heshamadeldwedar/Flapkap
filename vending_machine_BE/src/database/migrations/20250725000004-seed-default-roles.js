'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'buyer',
        description: 'User who can purchase products from the vending machine',
        created_at: new Date()
      },
      {
        name: 'seller',
        description: 'User who can manage products and view sales data',
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: {
        [Sequelize.Op.in]: ['buyer', 'seller']
      }
    });
  }
};