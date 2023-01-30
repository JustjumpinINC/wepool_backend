'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBlockLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
      this.belongsTo(models.Users, {
        foreignKey: 'block_user_id',
        targetKey: 'id',
        as: 'block_users',
      });
    }
  }
  UserBlockLogs.init(
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
      block_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserBlockLogs',
      tableName: 'user_block_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return UserBlockLogs;
};
