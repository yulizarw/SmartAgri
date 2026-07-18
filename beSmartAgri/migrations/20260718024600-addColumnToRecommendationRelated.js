'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('DecisionLogs', 'recommendationId', {
      type: Sequelize.INTEGER,
      references: { model: 'Recommendations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('DecisionLogs', 'recommendationId')
  }
};
