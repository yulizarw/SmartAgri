'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActuatorLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ActuatorLog.belongsTo(models.Actuator, {
        foreignKey: "actuatorId"
      });

    }
  }
  ActuatorLog.init({
    action: DataTypes.STRING,
    mode: DataTypes.STRING,
    trigger: DataTypes.STRING,
    duration: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ActuatorLog',
  });
  return ActuatorLog;
};