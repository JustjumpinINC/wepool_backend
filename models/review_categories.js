'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewCategories extends Model {
    static associate(models) {
      this.belongsTo(models.Reviews, {
        foreignKey: 'review_id',
        targetKey: 'id',
        as: 'reviews',
      });
      this.belongsTo(models.ReviewIconCategories, {
        foreignKey: 'review_icon_category_id',
        targetKey: 'id',
        as: 'review_icon_categories',
      });
    }
  }
  ReviewCategories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review_icon_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ReviewCategories',
      tableName: 'review_categories',
      timestamps: true,
      underscored: true,
    }
  );
  return ReviewCategories;
};
