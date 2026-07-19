'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Soil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Soil.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

    }
  }
  Soil.init({
    soilType: DataTypes.STRING,
    pH: DataTypes.FLOAT,
    texture: DataTypes.STRING,
    organicMatter: DataTypes.FLOAT,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Soil',
  });
  return Soil;
};