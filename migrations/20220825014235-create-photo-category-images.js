'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photo_category_images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      photo_image_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      photo_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('photo_category_images');
  }
};