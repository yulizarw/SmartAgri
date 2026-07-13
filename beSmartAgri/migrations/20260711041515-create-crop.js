'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Crops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cropName: {
        type: Sequelize.STRING
      },
      variety: {
        type: Sequelize.STRING
      },
      plantingDate: {
        type: Sequelize.DATE
      },
      estimatedHarvest: {
        type: Sequelize.DATE
      },
      harvestDate: {
        type: Sequelize.DATE
      },
      targetMoisture: {
        type: Sequelize.FLOAT
      },
      targetNDVI: {
        type: Sequelize.FLOAT
      },
      targetTemperature: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Crops');
  }
};