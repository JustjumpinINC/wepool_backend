'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carpool_ban_logs', {
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
      ban_carpool_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'carpools',
          key: 'id',
        },
      },
      ban_type: {
        type: Sequelize.ENUM('ads', 'bad_images', 'scam', 'porno', 'etc'),
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('request', 'complete', 'refuse'),
        defaultValue: 'request',
      },
      status_reason: {
        type: Sequelize.STRING,
      },
      completed_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('carpool_ban_logs');
  },
};
