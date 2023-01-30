'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarpoolLikes extends Model {
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
    }
  }
  CarpoolLikes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      carpool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_checked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'CarpoolLikes',
      tableName: 'carpool_likes',
      timestamps: true,
      underscored: true,
    }
  );
  return CarpoolLikes;
};
