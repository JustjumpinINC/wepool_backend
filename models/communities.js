'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Communities extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      }),
        this.belongsToMany(models.Users, {
          through: 'CommunityLikes',
          as: 'community_likes',
          foreignKey: 'community_id',
        });
      this.belongsToMany(models.Users, {
        through: 'CommunityBanLogs',
        as: 'community_ban_logs',
        foreignKey: 'ban_community_id',
      });
    }
  }
  Communities.init(
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
      type: {
        type: DataTypes.ENUM('free', 'etc'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['free', 'etc']],
            msg: 'type= free / etc 로만 입력해주세요.',
          },
        },
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
      },
      is_hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Communities',
      tableName: 'communities',
      timestamps: true,
      underscored: true,
    }
  );
  return Communities;
};
