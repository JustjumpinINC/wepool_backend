'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhotoImages extends Model {
    static associate(models) {
      this.belongsToMany(models.PhotoCategories, {
        through: 'PhotoCategoryImages',
        foreignKey: 'photo_image_id',
        as: 'photo_category_images',
      });
    }
  }
  PhotoImages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PhotoImages',
      tableName: 'photo_images',
      timestamps: true,
      underscored: true,
    }
  );
  return PhotoImages;
};
