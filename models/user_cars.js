'use strict';
const { Model } = require('sequelize');
const db = require('.');
module.exports = (sequelize, DataTypes) => {
  class UserCars extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      }),
        this.hasMany(models.UserCarInteriorImages, {
          foreignKey: 'user_car_id',
          sourceKey: 'id',
          as: 'user_car_interior_images',
        }),
        this.hasMany(models.UserCarExteriorImages, {
          foreignKey: 'user_car_id',
          sourceKey: 'id',
          as: 'user_car_exterior_images',
        });
    }
  }
  UserCars.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserCars',
      tableName: 'user_cars',
      timestamps: true,
      underscored: true,
    }
  );
  return UserCars;
};
