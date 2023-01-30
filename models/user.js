'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.UserCars, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_cars',
      }),
        this.hasOne(models.Admins, {
          foreignKey: 'user_id',
          sourceKey: 'id',
          as: 'admins',
        });
      this.hasMany(models.UserSearchLogs, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_search_logs',
      });
      this.hasMany(models.UserLocations, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_locations',
      });
      this.hasMany(models.Carpools, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'carpools',
      });
      this.hasMany(models.Communities, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'communities',
      });
      this.belongsToMany(models.Carpools, {
        through: 'CarpoolUsers',
        as: 'carpool_users',
        foreignKey: 'user_id',
      });
      this.hasMany(models.Reviews, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'reviews',
      });
      this.belongsToMany(models.Carpools, {
        through: 'CarpoolLikes',
        as: 'carpool_likes',
        foreignKey: 'user_id',
      });
      this.belongsToMany(models.Communities, {
        through: 'CommunityLikes',
        as: 'community_likes',
        foreignKey: 'user_id',
      });
      this.hasOne(models.DeviceTokens, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'device_tokens',
      });
      this.belongsToMany(models.Chats, {
        through: 'ChatUsers',
        as: 'chat_users',
        foreignKey: 'user_id',
      });
      this.hasMany(models.ChatMessages, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'chat_messages',
      });
      this.belongsToMany(models.Carpools, {
        through: 'CarpoolBanLogs',
        as: 'carpool_ban_logs',
        foreignKey: 'user_id',
      });
      this.belongsToMany(models.Communities, {
        through: 'CommunityBanLogs',
        as: 'community_ban_logs',
        foreignKey: 'user_id',
      });
      this.hasMany(models.UserBanLogs, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_ban_logs',
      });
      this.hasMany(models.UserBlockLogs, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_block_logs',
      });
      this.hasMany(models.UserSuspendLogs, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_suspend_logs',
      });
      this.hasMany(models.UserBlacklistLogs, {
        foreignKey: 'user_id',
        sourceKey: 'id',
        as: 'user_blacklist_logs',
      });
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      provider: {
        type: DataTypes.ENUM('KAKAO', 'APPLE', 'WEPOOL'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['KAKAO', 'APPLE', 'WEPOOL']],
            msg: 'provider= KAKAO / APPLE / WEPOOL 로만 입력해주세요.',
          },
        },
      },
      provider_uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nick_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['MALE', 'FEMALE']],
            msg: 'gender= MALE / FEMALE 로만 입력해주세요.',
          },
        },
      },
      age_range: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      profile_image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      account_holder: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      bank_id: {
        // TODO - 은행테이블 연결
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_smoke: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_chat_push: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_carpool_push: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_community_push: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      socket_id: {
        type: DataTypes.STRING(25),
      },
      is_login: {
        type: DataTypes.BOOLEAN,
      },
      last_login_at: {
        type: DataTypes.DATE,
      },
      login_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hidden_by: {
        type: DataTypes.ENUM('user', 'admin'),
        validate: {
          isIn: {
            args: [['user', 'admin']],
            msg: 'hidden_by= user / admin 로만 입력해주세요.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );
  return User;
};
