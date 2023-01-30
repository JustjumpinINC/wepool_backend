'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBanLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
      this.belongsTo(models.Users, {
        foreignKey: 'ban_user_id',
        targetKey: 'id',
        as: 'ban_users',
      });
    }
  }
  UserBanLogs.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ban_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('request', 'complete'),
        allowNull: false,
        defaultValue: 'request',
        validate: {
          isIn: {
            args: [['request', 'complete']],
            msg: 'status= request / complete 로만 입력해주세요.',
          },
        },
      },
      completed_reason: {
        type: DataTypes.STRING,
      },
      completed_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'UserBanLogs',
      tableName: 'user_ban_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return UserBanLogs;
};
