'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('GeeHistories', 'cropId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Crops',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('GeeHistories', 'cropId')
  }
};