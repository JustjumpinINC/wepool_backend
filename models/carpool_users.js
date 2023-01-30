'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarpoolUsers extends Model {
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
      this.hasMany(models.CarpoolCancels, {
        foreignKey: 'carpool_user_id',
        sourceKey: 'id',
        as: 'carpool_cancels',
      });
    }
  }
  CarpoolUsers.init(
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
    },
    {
      sequelize,
      modelName: 'CarpoolUsers',
      tableName: 'carpool_users',
      timestamps: true,
      underscored: true,
    }
  );
  return CarpoolUsers;
};
