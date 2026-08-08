'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class WeatherForecast extends Model {

    static associate(models) {

      WeatherForecast.belongsTo(
        models.Farm, {
          foreignKey: "farmId"
        }
      );

    }

  }

  WeatherForecast.init({

    date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    observationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    rain: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },

    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    humidity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    wind: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    cloud: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    soilMoisture: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },

    radiation: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },

    source: {
      type: DataTypes.STRING,
      allowNull: true
    },

    farmId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {

    sequelize,

    modelName: 'WeatherForecast',

    tableName: 'WeatherForecasts'

  });

  return WeatherForecast;
};