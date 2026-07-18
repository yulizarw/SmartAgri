'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('BatteryReadings', 'batteryId', {
      type: Sequelize.INTEGER,
      references: { model: 'Batteries', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('BatteryReadings', 'batteryId')
  }
};
