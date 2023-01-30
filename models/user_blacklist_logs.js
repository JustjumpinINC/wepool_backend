'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBlacklistLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
    }
  }
  UserBlacklistLogs.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING(50),
      },
    },
    {
      sequelize,
      modelName: 'UserBlacklistLogs',
      tableName: 'user_blacklist_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return UserBlacklistLogs;
};
