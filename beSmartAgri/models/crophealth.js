'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CropHealth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CropHealth.hasMany(models.Recommendation, {
        foreignKey: "cropHealthId"
      });

      CropHealth.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

      CropHealth.belongsTo(models.Crop, {
        foreignKey: "cropId"
      });


    }
  }
  CropHealth.init({
    date: DataTypes.DATE,
    vegetationScore: DataTypes.FLOAT,
    climateScore: DataTypes.FLOAT,
    soilScore: DataTypes.FLOAT,
    iotScore: DataTypes.FLOAT,
    overallScore: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'CropHealth',
  });
  return CropHealth;
};