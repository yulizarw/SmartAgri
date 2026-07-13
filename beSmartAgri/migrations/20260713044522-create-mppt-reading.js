'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MPPTReadings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inputVoltage: {
        type: Sequelize.FLOAT
      },
      inputCurrent: {
        type: Sequelize.FLOAT
      },
      outputVoltage: {
        type: Sequelize.FLOAT
      },
      outputCurrent: {
        type: Sequelize.FLOAT
      },
      batteryVoltage: {
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
    await queryInterface.dropTable('MPPTReadings');
  }
};