'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WaterTank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WaterTank.belongsTo(Farm, {
        foreignKey: "farmId"
      });

    }
  }
  WaterTank.init({
    capacity: DataTypes.FLOAT,
    currentVolume: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'WaterTank',
  });
  return WaterTank;
};