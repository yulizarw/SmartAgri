'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('MPPTReadings', 'mpptId', {
      type: Sequelize.INTEGER,
      references: { model: 'MPPTs', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('MPPTReadings', 'mpptId')
  }
};
