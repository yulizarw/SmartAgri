'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Recommendations', 'cropHealthId', {
        type: Sequelize.INTEGER,
        references: { model: 'CropHealths', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
      // ini harusnya di crop related
      queryInterface.addColumn('CropHealths', 'cropId', {
        type: Sequelize.INTEGER,
        references: { model: 'Crops', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }),
    ]) 
  },

  async down (queryInterface, Sequelize) {
     await Promise.all ([
      queryInterface.removeColumn('Recommendations', 'cropHealthId'),
      queryInterface.removeColumn('CropHealths', 'cropId')
     ]) 
  }
};
