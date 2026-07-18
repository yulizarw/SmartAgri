'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WeatherForecast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WeatherForecast.belongsTo(Farm, {
        foreignKey: "farmId"
      });

    }
  }
  WeatherForecast.init({
    date: DataTypes.DATE,
    rain: DataTypes.STRING,
    temperature: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    wind: DataTypes.FLOAT,
    cloud: DataTypes.FLOAT,
    source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WeatherForecast',
  });
  return WeatherForecast;
};