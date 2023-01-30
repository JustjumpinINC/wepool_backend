'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessages extends Model {
    static associate(models) {
      this.hasMany(models.ChatMessageMedias, {
        foreignKey: 'chat_message_id',
        sourceKey: 'id',
        as: 'chat_message_medias',
      });
      this.belongsTo(models.Chats, {
        foreignKey: 'chat_id',
        targetKey: 'id',
        as: 'chats',
      });
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
    }
  }
  ChatMessages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message_type: {
        type: DataTypes.ENUM(
          'join',
          'leave',
          'message',
          'media',
          'location',
          'paymnet_request',
          'payment_complete'
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              [
                'join',
                'leave',
                'message',
                'media',
                'location',
                'paymnet_request',
                'payment_complete',
              ],
            ],
            msg: 'message_type= join / leave / message / media / location / paymnet_request / payment_complete 로만 입력해주세요.',
          },
        },
      },
      message: {
        type: DataTypes.TEXT,
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
      modelName: 'ChatMessages',
      tableName: 'chat_messages',
      timestamps: true,
      underscored: true,
    }
  );
  return ChatMessages;
};
