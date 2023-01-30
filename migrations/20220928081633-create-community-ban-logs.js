'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('community_ban_logs', {
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
      ban_community_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'communities',
          key: 'id',
        },
      },
      ban_type: {
        type: Sequelize.ENUM('ads', 'bad_images', 'scam', 'etc'),
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('community_ban_logs');
  },
};
