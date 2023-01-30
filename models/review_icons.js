'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewIcons extends Model {
    static associate(models) {
      this.hasMany(models.ReviewIconCategories, {
        foreignKey: 'review_icon_id',
        sourceKey: 'id',
        as: 'review_icons',
      });
    }
  }
  ReviewIcons.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      icon_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      icon_image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ReviewIcons',
      tableName: 'review_icons',
      timestamps: true,
      underscored: true,
    }
  );
  return ReviewIcons;
};
