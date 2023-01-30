'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCarExteriorImages extends Model {
    static associate(models) {
      this.belongsTo(models.UserCars, {
        foreignKey: 'user_car_id',
        targetKey: 'id',
        as: 'user_cars',
      });
    }
  }
  UserCarExteriorImages.init(
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
      modelName: 'UserCarExteriorImages',
      tableName: 'user_car_exterior_images',
      timestamps: true,
      underscored: true,
    }
  );
  return UserCarExteriorImages;
};
