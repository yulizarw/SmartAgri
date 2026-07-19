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
    fullName:{
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Silahkan isi Nama Lengkap Anda'
        }
      }
    } ,
    email:{
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: 'Silahkan isi e-mail Anda'
        }
      }
    },
    password:{
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Silahkan isi password Anda'
        }
      }
    },
    phone:{
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Silahkan isi nomor telephone Anda'
        }
      }
    }, 
    address:{
      type:DataTypes.STRING,
      validate:{
        notEmpty:{
          msg:'Silahkan masukkan alamat lengkap Anda'
        }
      }
    }, 
    status:{
      type:DataTypes.BOOLEAN,
    } 
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