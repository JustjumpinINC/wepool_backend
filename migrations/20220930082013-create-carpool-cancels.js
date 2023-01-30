'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carpool_cancels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      carpool_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'carpool_users',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM(
          'no_reason',
          'user_schedule',
          'bad_communication',
          'bad_manner',
          'no_show',
          'etc'
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'request',
          'accept_request',
          'fail_by_writer',
          'fail_by_user'
        ),
        allowNull: false,
        defaultValue: 'request',
      },
      request_at: {
        type: Sequelize.STRING(20),
      },
      accept_at: {
        type: Sequelize.STRING(20),
      },
      fail_at: {
        type: Sequelize.STRING(20),
      },
      complete_at: {
        type: Sequelize.STRING(20),
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
    await queryInterface.dropTable('carpool_cancels');
  },
};
