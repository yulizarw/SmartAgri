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
      Farm.hasMany(Crop, {
        foreignKey: "farmId"
      });

      Farm.hasOne(Soil, {
        foreignKey: "farmId"
      });

      Farm.hasMany(Device, {
        foreignKey: "farmId"
      });

      Farm.hasMany(Pond, {
        foreignKey: "farmId"
      });

      Farm.hasMany(WaterTank, {
        foreignKey: "farmId"
      });

      Farm.hasMany(SolarPanel, {
        foreignKey: "farmId"
      });

      Farm.hasMany(Battery, {
        foreignKey: "farmId"
      });

      Farm.hasMany(MPPT, {
        foreignKey: "farmId"
      });

      Farm.hasMany(GeeHistory, {
        foreignKey: "farmId"
      });

      Farm.hasMany(CropHealth, {
        foreignKey: "farmId"
      });

      Farm.hasMany(Alert, {
        foreignKey: "farmId"
      });

      Farm.hasMany(WeatherForecast, {
        foreignKey: "farmId"
      });

      Farm.hasMany(Schedule, {
        foreignKey: "farmId"
      });

      Farm.hasMany(Experiment, {
        foreignKey: "farmId"
      });



      Farm.belongsTo(User, {
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