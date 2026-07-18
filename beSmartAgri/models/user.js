'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(Farm, {
        foreignKey: "userId"
      });

      User.hasMany(Experiment, {
        foreignKey: "userId"
      });

      User.hasMany(AuditLog, {
        foreignKey: "userId"
      });

      User.hasMany(Notification, {
        foreignKey: "userId"
      });



      User.belongsTo(Role, {
        foreignKey: "roleId"
      });

    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};