'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AIPrediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AIPrediction.init({
    date: DataTypes.DATE,
    predictedHarvest: DataTypes.DATE,
    predictedWeight: DataTypes.FLOAT,
    predictedWaterNeed: DataTypes.FLOAT,
    predictedHealth: DataTypes.FLOAT,
    modelVersion: DataTypes.STRING,
    accuracy: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'AIPrediction',
  });
  return AIPrediction;
};