'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewIconCategories extends Model {
    static associate(models) {
      this.belongsTo(models.ReviewIcons, {
        foreignKey: 'review_icon_id',
        targetKey: 'id',
        as: 'review_icons',
      });
      this.hasMany(models.ReviewCategories, {
        foreignKey: 'review_icon_category_id',
        sourceKey: 'id',
        as: 'review_categories',
      });
    }
  }
  ReviewIconCategories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      review_icon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('driver', 'rider'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['driver', 'rider']],
            msg: 'type= driver / rider 로만 입력해주세요.',
          },
        },
      },
      category_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ReviewIconCategories',
      tableName: 'review_icon_categories',
      timestamps: true,
      underscored: true,
    }
  );
  return ReviewIconCategories;
};
