'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SensorReadings', 'sensorId', {
      type: Sequelize.INTEGER,
      references: { model: 'Sensors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SensorReadings', 'sensorId')
  }
};
