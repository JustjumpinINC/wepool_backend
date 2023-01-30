'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarpoolBanLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      }),
        this.belongsTo(models.Carpools, {
          foreignKey: 'ban_carpool_id',
          targetKey: 'id',
          as: 'carpools',
        });
    }
  }
  CarpoolBanLogs.init(
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
      ban_carpool_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ban_type: {
        type: DataTypes.ENUM('ads', 'bad_images', 'scam', 'porno', 'etc'),
        allowNull: false,
        comment: '광고, 부적절한 사진 사용, 사기 글, 음란물, 기타',
        validate: {
          isIn: {
            args: [['ads', 'bad_images', 'scam', 'porno', 'etc']],
            msg: 'ban_type= ads / bad_images / scam / porno / etc 로만 입력해주세요.',
          },
        },
      },
      reason: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('request', 'complete', 'refuse'),
        defaultValue: 'request',
        comment: '요청, 완료, 요청거절',
        validate: {
          isIn: {
            args: [['request', 'complete', 'refuse']],
            msg: 'status= request / complete 로만 입력해주세요.',
          },
        },
      },
      status_reason: {
        type: DataTypes.STRING(50),
      },
      completed_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'CarpoolBanLogs',
      tableName: 'carpool_ban_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return CarpoolBanLogs;
};
