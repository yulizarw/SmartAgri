'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SolarReadings', 'solarPanelId', {
      type: Sequelize.INTEGER,
      references: { model: 'SolarPanels', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SolarReadings', 'solarPanelId')
  }
};
