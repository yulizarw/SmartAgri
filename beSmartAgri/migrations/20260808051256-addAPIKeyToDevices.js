'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn('Devices', 'apiKey', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        });
    },

    async down(queryInterface) {

        await queryInterface.removeColumn('Devices', 'apiKey');


    }
};