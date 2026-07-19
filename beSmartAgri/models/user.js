'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Farm, {
        foreignKey: "userId"
      });

      User.hasMany(models.Experiment, {
        foreignKey: "userId"
      });

      User.hasMany(models.AuditLog, {
        foreignKey: "userId"
      });

      User.hasMany(models.Notification, {
        foreignKey: "userId"
      });



      User.belongsTo(models.Role, {
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
     hooks:{
      beforeCreate(user){
        user.password = bcrypt.hashSync(user.password, 10);
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};