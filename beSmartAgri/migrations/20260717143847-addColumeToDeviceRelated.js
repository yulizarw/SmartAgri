'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all ([
      queryInterface.addColumn('Sensors', 'deviceId', {
        type: Sequelize.INTEGER,
        references: { model: 'Devices', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Actuators', 'deviceId', {
        type: Sequelize.INTEGER,
        references: { model: 'Devices', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Maintenances', 'deviceId', {
        type: Sequelize.INTEGER,
        references: { model: 'Devices', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all ([
      queryInterface.removeColumn('Sensors', 'deviceId'),
      queryInterface.removeColumn('Actuators', 'deviceId'),
      queryInterface.removeColumn('Maintenances', 'deviceId'),
    ])
  }
};
