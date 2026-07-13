'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BatteryReading extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BatteryReading.init({
    voltage: DataTypes.FLOAT,
    current: DataTypes.FLOAT,
    soc: DataTypes.FLOAT,
    temperature: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'BatteryReading',
  });
  return BatteryReading;
};