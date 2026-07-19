'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MPPTReading extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MPPTReading.belongsTo(models.MPPT, {
        foreignKey: "mpptId"
      });

    }
  }
  MPPTReading.init({
    inputVoltage: DataTypes.FLOAT,
    inputCurrent: DataTypes.FLOAT,
    outputVoltage: DataTypes.FLOAT,
    outputCurrent: DataTypes.FLOAT,
    batteryVoltage: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'MPPTReading',
  });
  return MPPTReading;
};