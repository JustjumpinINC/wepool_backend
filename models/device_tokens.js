'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeviceTokens extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
    }
  }
  DeviceTokens.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      os: {
        type: DataTypes.ENUM('Android', 'iOS'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Android', 'iOS']],
            msg: 'os= Android / iOS 로만 입력해주세요.',
          },
        },
      },
      device_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DeviceTokens',
      tableName: 'device_tokens',
      timestamps: true,
      underscored: true,
    }
  );
  return DeviceTokens;
};
