'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Crop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Crop.hasMany(models.CropHealth, {
        foreignKey: "cropId"
      });

      Crop.hasMany(models.GeeHistory, {
        foreignKey: "cropId"
      });


      Crop.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

    }
  }
  Crop.init({
    cropName: DataTypes.STRING,
    variety: DataTypes.STRING,
    plantingDate: DataTypes.DATE,
    estimatedHarvest: DataTypes.DATE,
    harvestDate: DataTypes.DATE,
    targetMoisture: DataTypes.FLOAT,
    targetNDVI: DataTypes.FLOAT,
    targetTemperature: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Crop',
  });
  return Crop;
};