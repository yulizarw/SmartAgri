'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pond extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pond.belongsTo(models.Farm, {
        foreignKey: "farmId"
      });

    }
  }
  Pond.init({
    capacity: DataTypes.FLOAT,
    currentVolume: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Pond',
  });
  return Pond;
};