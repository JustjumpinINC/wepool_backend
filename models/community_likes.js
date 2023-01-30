'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityLikes extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      }),
        this.belongsTo(models.Communities, {
          foreignKey: 'community_id',
          targetKey: 'id',
          as: 'communities',
        });
    }
  }
  CommunityLikes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      community_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_checked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'CommunityLikes',
      tableName: 'community_likes',
      timestamps: true,
      underscored: true,
    }
  );
  return CommunityLikes;
};
