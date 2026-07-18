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
    await Promise.all([
      queryInterface.addColumn('Crops', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Soil', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Devices', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Ponds', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('WaterTanks', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('SolarPanels', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Batteries', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('MPPTs', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('GeeHistories', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('CropHealths', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Alerts', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('WeatherForecasts', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Schedules', 'farmId', {
        type: Sequelize.INTEGER,
        references: { model: 'Farms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Crops', 'farmId'),
      queryInterface.removeColumn('Soil', 'farmId'),
      queryInterface.removeColumn('Devices', 'farmId'),
      queryInterface.removeColumn('Ponds', 'farmId'),
      queryInterface.removeColumn('WaterTanks', 'farmId'),
      queryInterface.removeColumn('SolarPanels', 'farmId'),
      queryInterface.removeColumn('Batteries', 'farmId'),
      queryInterface.removeColumn('MPPTs', 'farmId'),
      queryInterface.removeColumn('GeeHistories', 'farmId'),
      queryInterface.removeColumn('CropHealths', 'farmId'),
      queryInterface.removeColumn('Alerts', 'farmId'),
      queryInterface.removeColumn('WeatherForecasts', 'farmId'),
      queryInterface.removeColumn('Schedules', 'farmId'),
    ]);
  }
};
