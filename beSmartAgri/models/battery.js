'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Battery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Battery.hasMany(models.BatteryReading, {
        foreignKey: "batteryId"
      });

      Battery.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

    }
  }
  Battery.init({
    batteryName: DataTypes.STRING,
    capacityAh: DataTypes.FLOAT,
    voltage: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Battery',
  });
  return Battery;
};