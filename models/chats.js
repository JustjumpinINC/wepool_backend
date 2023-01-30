'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    static associate(models) {
      this.belongsToMany(models.Users, {
        through: 'ChatUsers',
        as: 'chat_users',
        foreignKey: 'chat_id',
      }),
        this.hasMany(models.ChatMessages, {
          foreignKey: 'chat_id',
          sourceKey: 'id',
          as: 'chat_messages',
        });
    }
  }
  Chats.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Chats',
      tableName: 'chats',
      timestamps: true,
      underscored: true,
    }
  );
  return Chats;
};
