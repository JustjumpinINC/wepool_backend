'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carpools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('request', 'complete'),
        allowNull: false,
        defaultValue: 'request',
      },
      type: {
        type: Sequelize.ENUM('rider', 'driver'),
        allowNull: false,
      },
      kind: {
        type: Sequelize.ENUM(
          'commute',
          'go_work',
          'leave_work',
          'travel',
          'etc'
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      start_address: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      start_latitude: {
        type: Sequelize.DECIMAL(18, 10),
        allowNull: false,
      },
      start_longitude: {
        type: Sequelize.DECIMAL(18, 10),
        allowNull: false,
      },
      arrive_address: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      arrive_latitude: {
        type: Sequelize.DECIMAL(18, 10),
        allowNull: false,
      },
      arrive_longitude: {
        type: Sequelize.DECIMAL(18, 10),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('carpools');
  },
};
