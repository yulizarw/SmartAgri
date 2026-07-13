'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SolarPanel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SolarPanel.init({
    panelName: DataTypes.STRING,
    capacityWp: DataTypes.FLOAT,
    manufacturer: DataTypes.STRING,
    installDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SolarPanel',
  });
  return SolarPanel;
};