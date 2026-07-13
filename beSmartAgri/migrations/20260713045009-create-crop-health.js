'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CropHealths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      vegetationScore: {
        type: Sequelize.FLOAT
      },
      climateScore: {
        type: Sequelize.FLOAT
      },
      soilScore: {
        type: Sequelize.FLOAT
      },
      iotScore: {
        type: Sequelize.FLOAT
      },
      overallScore: {
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
    await queryInterface.dropTable('CropHealths');
  }
};