'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experiment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Experiment.hasMany(ExperimentResult, {
        foreignKey: "experimentId"
      });

      Experiment.belongsTo(User, {
        foreignKey: "userId"
      });

      Experiment.belongsTo(Farm, {
        foreignKey: "farmId"
      });


    }
  }
  Experiment.init({
    title: DataTypes.STRING,
    objective: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Experiment',
  });
  return Experiment;
};