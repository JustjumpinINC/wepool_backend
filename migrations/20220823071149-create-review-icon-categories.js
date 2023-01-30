'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('review_icon_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      review_icon_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'review_icons',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM('driver', 'rider'),
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
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
    await queryInterface.dropTable('review_icon_categories');
  },
};
