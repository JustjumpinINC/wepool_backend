'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessageMedias extends Model {
    static associate(models) {
      this.belongsTo(models.ChatMessages, {
        foreignKey: 'chat_message_id',
        targetKey: 'id',
        as: 'chat_message_medias',
      });
    }
  }
  ChatMessageMedias.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      chat_message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ChatMessageMedias',
      tableName: 'chat_message_medias',
      timestamps: true,
      underscored: true,
    }
  );
  return ChatMessageMedias;
};
