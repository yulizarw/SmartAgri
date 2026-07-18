'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all ([
      queryInterface.addColumn('AuditLogs', 'userId', {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
      queryInterface.addColumn('Notifications', 'userId', {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    await Promise.all ([
       queryInterface.removeColumn('AuditLogs', 'userId'),
       queryInterface.removeColumn('Notifications', 'userId')

    ])
  }
};
