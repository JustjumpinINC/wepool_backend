'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      provider: {
        type: Sequelize.ENUM('KAKAO', 'APPLE', 'WEPOOL'),
        allowNull: false,
      },
      provider_uid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      nick_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE'),
        allowNull: false,
      },
      age_range: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      distance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      profile_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      account_holder: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      bank_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_smoke: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_chat_push: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_carpool_push: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_community_push: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      socket_id: {
        type: Sequelize.STRING(25),
      },
      is_login: {
        type: Sequelize.BOOLEAN,
      },
      last_login_at: {
        type: Sequelize.DATE,
      },
      login_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hidden_by: {
        type: Sequelize.ENUM('user', 'admin'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
