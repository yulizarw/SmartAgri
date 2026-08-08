'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // =========================================
    // UBAH RAIN DARI VARCHAR -> DOUBLE
    // =========================================

    await queryInterface.sequelize.query(`
            ALTER TABLE "WeatherForecasts"
            DROP COLUMN IF EXISTS "rain";
        `);

    await queryInterface.addColumn(
      'WeatherForecasts',
      'rain', {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    );


    // =========================================
    // SOIL MOISTURE
    // =========================================

    await queryInterface.addColumn(
      'WeatherForecasts',
      'soilMoisture', {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    );


    // =========================================
    // RADIATION
    // =========================================

    await queryInterface.addColumn(
      'WeatherForecasts',
      'radiation', {
        type: Sequelize.DOUBLE,
        allowNull: true
      }
    );


    // =========================================
    // TANGGAL OBSERVASI GEE
    // =========================================

    await queryInterface.addColumn(
      'WeatherForecasts',
      'observationDate', {
        type: Sequelize.DATE,
        allowNull: true
      }
    );
  },


  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      'WeatherForecasts',
      'observationDate'
    );

    await queryInterface.removeColumn(
      'WeatherForecasts',
      'radiation'
    );

    await queryInterface.removeColumn(
      'WeatherForecasts',
      'soilMoisture'
    );

    await queryInterface.removeColumn(
      'WeatherForecasts',
      'rain'
    );

    // Kembalikan rain ke VARCHAR
    await queryInterface.addColumn(
      'WeatherForecasts',
      'rain', {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  }
};