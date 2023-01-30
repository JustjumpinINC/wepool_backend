'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLocations extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
    }
  }
  UserLocations.init(
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
      location_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '내 집',
      },
      address: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address_detail: {
        type: DataTypes.STRING(50),
      },
      latitude: {
        type: DataTypes.DECIMAL(18, 10),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(18, 10),
        allowNull: false,
      },
      start_selected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      arrive_selected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      total_use_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'UserLocations',
      tableName: 'user_locations',
      timestamps: true,
      underscored: true,
    }
  );
  return UserLocations;
};
