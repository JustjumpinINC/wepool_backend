const { Op } = require('sequelize');
const { Users } = require('../../../../models');

// 관리자 게시글 조회
const getAllPaymentByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: Post']
          #swagger.summary = '관리자 게시글 조회'
          #swagger.description = '관리자 게시글 조회'  */

  /*  #swagger.responses[200] =  {
              description: '관리자 게시글 조회 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 게시글 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 게시글 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res
      .status(200)
      .json({ code: 200, message: '관리자 게시글 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 관리자 게시글 상세 조회
const getOnePaymentByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: Post']
          #swagger.summary = '관리자 게시글 상세 조회'
          #swagger.description = '관리자 게시글 상세 조회'  */

  /*  #swagger.responses[200] =  {
              description: '관리자 게시글 상세 조회 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 게시글 상세 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 게시글 상세 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res
      .status(200)
      .json({ code: 200, message: '관리자 게시글 상세 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 관리자 결제 환불
const refundPaymentByAdmin = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: Post']
            #swagger.summary = '관리자 결제 환불'
            #swagger.description = '관리자 결제 환불'  */

  /*  #swagger.responses[200] =  {
                description: '관리자 결제 환불 성공',
                schema: {   "code" : 200,
                            "message" : "관리자 결제 환불 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '관리자 결제 환불 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res
      .status(200)
      .json({ code: 200, message: '관리자 결제 환불 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getAllPaymentByAdmin,
  getOnePaymentByAdmin,
  refundPaymentByAdmin,
};
