'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WeatherForecasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      rain: {
        type: Sequelize.STRING
      },
      temperature: {
        type: Sequelize.FLOAT
      },
      humidity: {
        type: Sequelize.FLOAT
      },
      wind: {
        type: Sequelize.FLOAT
      },
      cloud: {
        type: Sequelize.FLOAT
      },
      source: {
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
    await queryInterface.dropTable('WeatherForecasts');
  }
};