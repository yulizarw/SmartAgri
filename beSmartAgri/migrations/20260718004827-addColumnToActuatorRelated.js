'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('ActuatorLogs', 'actuatorId', {
      type: Sequelize.INTEGER,
      references: { model: 'Actuators', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ActuatorLogs', 'actuatorId')
  }
};
