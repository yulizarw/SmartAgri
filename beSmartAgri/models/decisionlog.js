'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DecisionLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DecisionLog.init({
    sensorValue: DataTypes.FLOAT,
    geeValue: DataTypes.FLOAT,
    confidence: DataTypes.FLOAT,
    decision: DataTypes.STRING,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DecisionLog',
  });
  return DecisionLog;
};