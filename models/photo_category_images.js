'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhotoCategoryImages extends Model {
    static associate(models) {}
  }
  PhotoCategoryImages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      photo_image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PhotoCategoryImages',
      tableName: 'photo_category_images',
      timestamps: true,
      underscored: true,
    }
  );
  return PhotoCategoryImages;
};
