'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Device.hasMany(models.Sensor, {
        foreignKey: "deviceId"
      });

      Device.hasMany(models.Actuator, {
        foreignKey: "deviceId"
      });

      Device.hasMany(models.Maintenance, {
        foreignKey: "deviceId"
      });




      Device.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

    }
  }
  Device.init({
    deviceCode: DataTypes.STRING,
    deviceName: DataTypes.STRING,
    firmWare: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};