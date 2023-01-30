const { getReviewList, getGoodReivew } = require('../../../../src/reviewCount');
const { Op } = require('sequelize');

const {
  Users,
  UserCars,
  Reviews,
  ReviewCategories,
  ReviewIconCategories,
  UserCarExteriorImages,
  UserCarInteriorImages,
  UserBanLogs,
  UserBlockLogs,
} = require('../../../../models');

// 다른회원 조회
const getUserPage = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['User']
          #swagger.summary = '다른회원 조회 '
          #swagger.description = '다른회원 조회' */

  /*  #swagger.responses[200] =  {
              description: '다른회원 조회 성공',
              schema: {   "code" : 200,
                          "message" : "다른회원 조회 성공",
                          "data": { $ref: '#/components/schemas/User/userpage' }}}
  
      /*  #swagger.responses[400] = {
              description: '다른회원 조회 실패',
              schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/
  try {
    const { user_id } = req.params;

    // 1. 회원의 "최고였어요" 갯수 조회
    const good_review_count = await getGoodReivew(user_id);

    // 2. 받은 리뷰 조회
    const review_id_list = await getReviewList(user_id);
    console.log(review_id_list, '받은거');

    const review_list = await Reviews.findAll({
      where: {
        id: {
          [Op.or]: review_id_list,
        },
      },
      attributes: [
        'id',
        'carpool_id',
        'user_id',
        'content',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Users,
          as: 'users',
          attributes: ['id', 'nick_name', 'profile_image_url'],
        },
        {
          model: ReviewCategories,
          as: 'review_categories',
          attributes: [
            'id',
            'review_id',
            'review_icon_category_id',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: ReviewIconCategories,
              as: 'review_icon_categories',
              attributes: ['id', 'type', 'category_name'],
            },
          ],
        },
      ],
    });

    // 3. 회원 정보 조회
    const userInfo = await Users.findByPk(user_id);
    const user = {
      user_id: userInfo.id,
      profile_image_url: userInfo.profile_image_url,
      nick_name: userInfo.nick_name,
      is_smoke: userInfo.is_smoke,
      gender: userInfo.gender,
      good_review_count,
    };

    // 4. 인증 조회 <=======================================보류
    const auth_list = {};

    // 5. 회원 자동차 정보 조회
    const car = await UserCars.findOne({
      where: { user_id },
      include: [
        {
          model: UserCarExteriorImages,
          as: 'user_car_exterior_images',
          attributes: ['image_url'],
        },
        {
          model: UserCarInteriorImages,
          as: 'user_car_interior_images',
          attributes: ['image_url'],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: '다른회원 조회 성공',
      data: { user, auth_list, car, review_list },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 신고
const banUser = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['User']
            #swagger.summary = '회원 신고'
            #swagger.description = '회원 신고' */

  /*	#swagger.parameters['payload'] = {
                in: 'body',
                description: 'Request Body',
                required: true,
                schema: {   $ref: '#/components/schemas/User/ban_user'  }} 

        /*  #swagger.responses[200] =  {  
                description: '회원 신고 성공',
                schema: {   "code" : 200, 
                            "message" : "회원 신고 성공"}}
    
        /*  #swagger.responses[400] = { 
                description: '회원 신고 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
    
        ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { ban_user_id } = req.params; // 신고하고 싶은 회원
    const { reason } = req.body;

    // [오류] 이미 신고한 회원인 경우
    await UserBanLogs.findOne({
      where: { user_id, ban_user_id },
      attributes: ['id'],
    }).then((ban) => {
      console.log(ban);
      if (ban) {
        throw new Error('이미 신고된 회원입니다.');
      }
    });

    await UserBanLogs.create({
      user_id,
      ban_user_id,
      reason,
    })
      .then(() => {
        return res.status(200).json({ code: 200, message: '회원 신고 성공' });
      })
      .catch((error) => {
        // [오류] 시퀄라이즈 오류
        if (error.name == 'SequelizeValidationError') {
          return res.status(400).json({
            code: 400,
            message: '올바르지 않는 정보: ' + error.errors[0].message,
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 차단
const blockUser = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['User']
            #swagger.summary = '회원 차단'
            #swagger.description = '회원 차단' */

  /*  #swagger.responses[200] =  {  
                description: '회원 차단 성공',
                schema: {   "code" : 200, 
                            "message" : "회원 차단 성공"}}
    
        /*  #swagger.responses[400] = { 
                description: '회원 차단 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
    
        ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { block_user_id } = req.params; // 차단하고 싶은 회원

    // [오류] 이미 신고한 회원인 경우
    await UserBlockLogs.findOne({
      where: { user_id, block_user_id },
      attributes: ['id'],
    }).then((block) => {
      if (block) {
        throw new Error('이미 차단된 회원입니다.');
      }
    });

    await UserBlockLogs.create({
      user_id,
      block_user_id,
    })
      .then(() => {
        return res.status(200).json({ code: 200, message: '회원 차단 성공' });
      })
      .catch((error) => {
        // [오류] 시퀄라이즈 오류
        if (error.name == 'SequelizeValidationError') {
          return res.status(400).json({
            code: 400,
            message: '올바르지 않는 정보: ' + error.errors[0].message,
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getUserPage,
  banUser,
  blockUser,
};
