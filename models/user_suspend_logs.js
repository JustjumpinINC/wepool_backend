'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSuspendLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
    }
  }
  UserSuspendLogs.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      ban_type: {
        type: DataTypes.ENUM('carpool', 'community', 'user'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['carpool', 'community', 'user']],
            msg: 'ban_type= carpool / community / user로만 입력해주세요.',
          },
        },
      },
      ban_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserSuspendLogs',
      tableName: 'user_suspend_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return UserSuspendLogs;
};
