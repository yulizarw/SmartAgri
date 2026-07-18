'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sensor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Sensor.hasMany(SensorReading, {
        foreignKey: "sensorId"
      });

      Sensor.belongsTo(Device, {
        foreignKey: "deviceId"
      });

    }
  }
  Sensor.init({
    sensorType: DataTypes.STRING,
    pin: DataTypes.STRING,
    unit: DataTypes.STRING,
    location: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Sensor',
  });
  return Sensor;
};