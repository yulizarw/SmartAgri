'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up (queryInterface, Sequelize) {
    await Promise.all ([
      queryInterface.addColumn('Devices', 'macAddress', {
      type: Sequelize.STRING,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Devices', 'connectionType', {
      type: Sequelize.STRING,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Devices', 'lastSeen', {
      type: Sequelize.DATE,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all ([
       queryInterface.removeColumn('Devices', 'macAddress'),
       queryInterface.removeColumn('Devices', 'connectionType'),
       queryInterface.removeColumn('Devices', 'lastSeen'),

    ])
  }
};
