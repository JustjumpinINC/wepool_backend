'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSearchLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
    }
  }
  UserSearchLogs.init(
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
      keyword: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserSearchLogs',
      tableName: 'user_search_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return UserSearchLogs;
};
