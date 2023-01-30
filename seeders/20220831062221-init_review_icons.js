'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'review_icons',
      [
        {
          icon_name: '별로였어요',
          icon_image_url: 'sad face',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          icon_name: '괜찮았어요',
          icon_image_url: 'um face',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          icon_name: '최고였어요',
          icon_image_url: 'happy face',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('review_icons', null, {});
  },
};
