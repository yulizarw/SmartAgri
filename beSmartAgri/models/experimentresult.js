'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExperimentResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExperimentResult.belongsTo(models.Experiment, {
        foreignKey: "experimentId"
      });

    }
  }
  ExperimentResult.init({
    cropHealthScore: DataTypes.FLOAT,
    yieldWeight: DataTypes.FLOAT,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ExperimentResult',
  });
  return ExperimentResult;
};