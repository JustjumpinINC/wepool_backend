'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'contact_us',
      [
        {
          type: 'call',
          info: '02-6953-4977',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: 'email',
          info: 'help@jumpin.co.kr',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('contact_us', null, {});
  },
};
