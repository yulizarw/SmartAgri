'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GeeHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      ndvi: {
        type: Sequelize.FLOAT
      },
      evi: {
        type: Sequelize.FLOAT
      },
      gndvi: {
        type: Sequelize.FLOAT
      },
      savi: {
        type: Sequelize.FLOAT
      },
      ndmi: {
        type: Sequelize.FLOAT
      },
      ndwi: {
        type: Sequelize.FLOAT
      },
      msi: {
        type: Sequelize.FLOAT
      },
      lai: {
        type: Sequelize.FLOAT
      },
      fvc: {
        type: Sequelize.FLOAT
      },
      rainfall: {
        type: Sequelize.FLOAT
      },
      soilMoisture: {
        type: Sequelize.FLOAT
      },
      temperature: {
        type: Sequelize.FLOAT
      },
      radiation: {
        type: Sequelize.FLOAT
      },
      wind: {
        type: Sequelize.FLOAT
      },
      humidity: {
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
    await queryInterface.dropTable('GeeHistories');
  }
};