'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('review_icon_categories', [{
        review_icon_id: 1,
        type: 'driver',
        category_name: '약속을 지키지 않음',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'driver',
        category_name: '차가 청결하지 않음',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'driver',
        category_name: '불쾌한 언행',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'driver',
        category_name: '과격한 운행',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'driver',
        category_name: '추가 요금 권유',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'driver',
        category_name: '개인정보 공유',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'driver',
        category_name: '약속을 잘 지킴',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'driver',
        category_name: '운전을 잘 함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'driver',
        category_name: '차가 깨끗함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'driver',
        category_name: '편안한 운행',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'driver',
        category_name: '친절함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '약속을 잘 지킴',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '운전을 잘 함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '차가 깨끗함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '편안한 운행',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '친절함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '재밌는 대화',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'driver',
        category_name: '출발지/목적지를 맞춰줌',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'rider',
        category_name: '약속을 잘 지키지 않음',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'rider',
        category_name: '불쾌한 언행',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'rider',
        category_name: '과도한 요구',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'rider',
        category_name: '예의바름',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 1,
        type: 'rider',
        category_name: '개인정보 요구',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'rider',
        category_name: '약속을 잘 지킴',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'rider',
        category_name: '친절함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'rider',
        category_name: '예의바름',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 2,
        type: 'rider',
        category_name: '편안한 대화',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'rider',
        category_name: '약속을 잘 지킴',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'rider',
        category_name: '친절함',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'rider',
        category_name: '예의바름',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        review_icon_id: 3,
        type: 'rider',
        category_name: '편안한 대화',
        created_at: new Date(),
        updated_at: new Date()
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('review_icon_categories', null, {});
  }
};
