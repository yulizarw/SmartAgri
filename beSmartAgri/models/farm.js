'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Farm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Farm.hasMany(models.Crop, {
        foreignKey: "farmId"
      });

      Farm.hasOne(models.Soil, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.Device, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.Pond, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.WaterTank, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.SolarPanel, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.Battery, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.MPPT, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.GeeHistory, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.CropHealth, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.Alert, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.WeatherForecast, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.Schedule, {
        foreignKey: "farmId"
      });

      Farm.hasMany(models.Experiment, {
        foreignKey: "farmId"
      });



      Farm.belongsTo(models.User, {
        foreignKey: "userId"
      });

    }
  }
  Farm.init({
    name: DataTypes.STRING,
    area: DataTypes.FLOAT,
    polygon: DataTypes.JSONB,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    address: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Farm',
  });
  return Farm;
};