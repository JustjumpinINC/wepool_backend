const { Op } = require('sequelize');
const {
  Carpools,
  Reviews,
  ReviewCategories,
  ReviewIconCategories,
} = require('../models');

// 리뷰 리스트 조회
const getReviewList = async (user_id) => {
  // 1. 회원이 작성한 게시글 조회
  let carpool_list = [];
  await Carpools.findAll({
    where: { user_id },
    attributes: ['id'],
  }).then((carpools) => {
    for (carpool of carpools) {
      carpool_list.push(carpool.id);
    }
  });

  // 2. 회원에게 작성된 리뷰 조회
  let review_id_list = [];
  await Reviews.findAll({
    where: {
      carpool_id: { [Op.or]: carpool_list },
    },
    attributes: ['id'],
  }).then((reviews) => {
    for (review of reviews) {
      review_id_list.push(review.id);
    }
  });

  return review_id_list;
};

// 회원의 "최고였어요" 갯수 조회
const getGoodReivew = async (user_id) => {
  const review_id_list = await getReviewList(user_id);

  const goodReviews = await ReviewCategories.findAll({
    where: {
      review_id: {
        [Op.or]: review_id_list,
      },
    },
    include: [
      {
        model: ReviewIconCategories,
        as: 'review_icon_categories',
        attributes: [],
        where: { review_icon_id: 3 },
      },
    ],
    group: ['review_id'],
  });

  return goodReviews.length;
};

module.exports = {
  getReviewList,
  getGoodReivew,
};
