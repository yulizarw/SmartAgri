'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actuator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Actuator.hasMany(ActuatorLog, {
        foreignKey: "actuatorId"
      });

      Actuator.belongsTo(Device, {
        foreignKey: "deviceId"
      });

    }
  }
  Actuator.init({
    actuatorType: DataTypes.STRING,
    name: DataTypes.STRING,
    relaypin: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Actuator',
  });
  return Actuator;
};