'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeeHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GeeHistory.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

      GeeHistory.belongsTo(models.Crop, {
        foreignKey: "cropId"
      });


    }
  }
  GeeHistory.init({
    date: DataTypes.DATE,
    ndvi: DataTypes.FLOAT,
    evi: DataTypes.FLOAT,
    gndvi: DataTypes.FLOAT,
    savi: DataTypes.FLOAT,
    ndmi: DataTypes.FLOAT,
    ndwi: DataTypes.FLOAT,
    msi: DataTypes.FLOAT,
    lai: DataTypes.FLOAT,
    fvc: DataTypes.FLOAT,
    rainfall: DataTypes.FLOAT,
    soilMoisture: DataTypes.FLOAT,
    temperature: DataTypes.FLOAT,
    radiation: DataTypes.FLOAT,
    wind: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'GeeHistory',
  });
  return GeeHistory;
};