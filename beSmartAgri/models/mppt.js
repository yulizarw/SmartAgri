'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MPPT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MPPT.hasMany(models.MPPTReading, {
        foreignKey: "mpptId"
      });

      MPPT.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

    }
  }
  MPPT.init({
    brand: DataTypes.STRING,
    model: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MPPT',
  });
  return MPPT;
};