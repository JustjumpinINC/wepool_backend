'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCarInteriorImages extends Model {
    static associate(models) {
      this.belongsTo(models.UserCars, {
        foreignKey: 'user_car_id',
        targetKey: 'id',
        as: 'user_cars',
      });
    }
  }
  UserCarInteriorImages.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      user_car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserCarInteriorImages',
      tableName: 'user_car_interior_images',
      timestamps: true,
      underscored: true,
    }
  );
  return UserCarInteriorImages;
};
