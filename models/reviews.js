'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
      this.belongsTo(models.Carpools, {
        foreignKey: 'carpool_id',
        targetKey: 'id',
        as: 'carpools',
      });
      this.hasMany(models.ReviewCategories, {
        foreignKey: 'review_id',
        sourceKey: 'id',
        as: 'review_categories',
      });
    }
  }
  Reviews.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      carpool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Reviews',
      tableName: 'reviews',
      timestamps: true,
      underscored: true,
    }
  );
  return Reviews;
};
