'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carpools extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'users',
      });
      this.belongsToMany(models.Users, {
        through: 'CarpoolUsers',
        as: 'carpool_users',
        foreignKey: 'carpool_id',
      });
      this.belongsToMany(models.Users, {
        through: 'CarpoolLikes',
        as: 'carpool_likes',
        foreignKey: 'carpool_id',
      });
      this.hasMany(models.Reviews, {
        foreignKey: 'carpool_id',
        sourceKey: 'id',
        as: 'reviews',
      });
      this.belongsToMany(models.Users, {
        through: 'CarpoolBanLogs',
        as: 'carpool_ban_logs',
        foreignKey: 'ban_carpool_id',
      });
    }
  }
  Carpools.init(
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
      status: {
        type: DataTypes.ENUM('request', 'complete'),
        allowNull: false,
        defaultValue: 'request',
        validate: {
          isIn: {
            args: [['request', 'complete']],
            msg: 'status= request / complete 로만 입력해주세요.',
          },
        },
      },
      type: {
        type: DataTypes.ENUM('rider', 'driver'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['rider', 'driver']],
            msg: 'type= rider / driver 로만 입력해주세요.',
          },
        },
      },
      kind: {
        type: DataTypes.ENUM(
          'commute',
          'go_work',
          'leave_work',
          'travel',
          'etc'
        ),
        allowNull: false,
        comment: '출퇴근, 출근, 퇴근, 여행, 기타',
        validate: {
          isIn: {
            args: [['commute', 'go_work', 'leave_work', 'travel', 'etc']],
            msg: 'kind= commute / go_work / leave_work / travel / etc 로만 입력해주세요.',
          },
        },
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      start_address: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      start_latitude: {
        type: DataTypes.DECIMAL(18, 10),
        allowNull: false,
      },
      start_longitude: {
        type: DataTypes.DECIMAL(18, 10),
        allowNull: false,
      },
      arrive_address: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      arrive_latitude: {
        type: DataTypes.DECIMAL(18, 10),
        allowNull: false,
      },
      arrive_longitude: {
        type: DataTypes.DECIMAL(18, 10),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      modelName: 'Carpools',
      tableName: 'carpools',
      timestamps: true,
      underscored: true,
    }
  );

  return Carpools;
};
