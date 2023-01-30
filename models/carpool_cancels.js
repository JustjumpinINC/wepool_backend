'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarpoolCancels extends Model {
    static associate(models) {
      this.belongsTo(models.CarpoolUsers, {
        foreignKey: 'carpool_user_id',
        sourceKey: 'id',
        as: 'carpool_users',
      });
    }
  }
  CarpoolCancels.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      carpool_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          'no_reason',
          'user_schedule',
          'bad_communication',
          'bad_manner',
          'no_show',
          'etc'
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              [
                'no_reason',
                'user_schedule',
                'bad_communication',
                'bad_manner',
                'no_show',
                'etc',
              ],
            ],
            msg: 'type= no_reason(단순 변심) / user_schedule(갑작스러운 일정변경) / bad_communication(의견 충돌) / bad_manner(비매너) / no_show(약속 불이행) / etc(기타) 로만 입력해주세요.',
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
          'request',
          'accept_request',
          'fail_by_writer',
          'fail_by_user'
        ),
        allowNull: false,
        validate: {
          isIn: {
            args: [
              ['request', 'accept_request', 'fail_by_writer', 'fail_by_user'],
            ],
            msg: 'status= request(취소 요청) / accept_request(취소 동의) / fail_by_writer(게시자 취소) / fail_by_user(이용자 취소) 로만 입력해주세요.',
          },
        },
        defaultValue: 'request',
      },
      request_at: {
        type: DataTypes.STRING(20),
        comment: '취소 요청시',
      },
      accept_at: {
        type: DataTypes.STRING(20),
        comment: '취소 동의 시',
      },
      fail_at: {
        type: DataTypes.STRING(20),
        comment: '취소 실패 시',
      },
    },
    {
      sequelize,
      modelName: 'CarpoolCancels',
      tableName: 'carpool_cancels',
      timestamps: true,
      underscored: true,
    }
  );
  return CarpoolCancels;
};
