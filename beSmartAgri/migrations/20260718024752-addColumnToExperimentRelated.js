'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Experiments', 'userId', {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('ExperimentResults', 'experimentId', {
      type: Sequelize.INTEGER,
      references: { model: 'Experiments', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
      // harusnya ini di FarmRelated Migration tapi karena udah di up jadi disini aja deh
      queryInterface.addColumn('Experiments', 'farmId', {
      type: Sequelize.INTEGER,
      references: { model: 'Farms', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Experiments', 'userId'),
      queryInterface.removeColumn('ExperimentResults', 'experimentId'),
      queryInterface.removeColumn('Experiments', 'farmId')
    ])
  }
};
