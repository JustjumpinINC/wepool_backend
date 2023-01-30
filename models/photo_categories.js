'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhotoCategories extends Model {
    static associate(models) {
      this.belongsToMany(models.PhotoImages, {
        through: 'PhotoCategoryImages',
        foreignKey: 'photo_category_id',
        as: 'photo_category_images',
      });
    }
  }
  PhotoCategories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      category_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PhotoCategories',
      tableName: 'photo_categories',
      timestamps: true,
      underscored: true,
    }
  );
  return PhotoCategories;
};
