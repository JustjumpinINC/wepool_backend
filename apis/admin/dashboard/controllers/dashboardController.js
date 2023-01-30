const { Op } = require('sequelize');
const { Users } = require('../../../../models');

// 관리자 대시보드 조회 (보류)
const getAllInfo = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: Dashboard']
          #swagger.summary = '관리자 대시보드 조회'
          #swagger.description = '관리자 대시보드 조회'  */

  /*  #swagger.responses[200] =  {
              description: '관리자 대시보드 조회 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 대시보드 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 대시보드 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    // 1. 회원 통계
    // 1-1. 총 회원 수
    const total_user = await Users.findAndCountAll({ attributes: ['id'] });

    // 1-2. 신규 가입 회원 (일주일)
    const new_user = await Users.findAndCountAll({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.parse(new Date()) - 7 * 1000 * 60 * 60 * 24), // 7일 전 ~ 현재까지의 데이터
        },
      },
      attributes: ['id', 'created_at'],
    });

    // 1-3. 활성 사용자 (한달에 한번 이상 사용자)
    const active_user = await Users.findAndCountAll({
      where: {
        last_login_at: {
          [Op.gte]: new Date(Date.parse(new Date()) - 30 * 1000 * 60 * 60 * 24), // 한달 전 ~ 현재까지의 데이터
        },
      },
      attributes: ['id', 'last_login_at'],
    });

    // 1-4. 인증한 사용자 (보류)

    return res.status(200).json({
      code: 200,
      message: '관리자 대시보드 조회 성공',
      data: {
        total_user_count: total_user.count,
        new_user_count: new_user.count,
        active_user_count: active_user.count,
      },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getAllInfo,
};
