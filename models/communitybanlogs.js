'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityBanLogs extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      }),
        this.belongsTo(models.Communities, {
          foreignKey: 'ban_community_id',
          targetKey: 'id',
          as: 'communities',
        });
    }
  }
  CommunityBanLogs.init(
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
      ban_community_id: {
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
    },
    {
      sequelize,
      modelName: 'CommunityBanLogs',
      tableName: 'community_ban_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return CommunityBanLogs;
};
