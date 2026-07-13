'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AIPredictions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      predictedHarvest: {
        type: Sequelize.DATE
      },
      predictedWeight: {
        type: Sequelize.FLOAT
      },
      predictedWaterNeed: {
        type: Sequelize.FLOAT
      },
      predictedHealth: {
        type: Sequelize.FLOAT
      },
      modelVersion: {
        type: Sequelize.STRING
      },
      accuracy: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('AIPredictions');
  }
};