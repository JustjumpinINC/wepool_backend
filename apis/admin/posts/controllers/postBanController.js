const { Op } = require('sequelize');
const { Users } = require('../../../../models');

// 신고된 게시물 전체 조회
const getAllBanPost = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '신고된 게시물 전체 조회'
          #swagger.description = '신고된 게시물 전체 조회'  */

  /*  #swagger.responses[200] =  {
              description: '신고된 게시물 전체 조회 성공',
              schema: {   "code" : 200,
                          "message" : "신고된 게시물 전체 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '신고된 게시물 전체 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '신고된 게시물 전체 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 신고된 게시물 상세 조회
const getOneBanPost = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: User']
            #swagger.summary = '신고된 게시물 상세 조회'
            #swagger.description = '신고된 게시물 상세 조회'  */

  /*  #swagger.responses[200] =  {
                description: '신고된 게시물 상세 조회 성공',
                schema: {   "code" : 200,
                            "message" : "신고된 게시물 상세 조회 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '신고된 게시물 상세 조회 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '신고된 게시물 상세 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시물 신고 거절
const refuseBanPost = async (req, res) => {
  /*========================================================================================================
          /* 	#swagger.tags = ['Admin: User']
              #swagger.summary = '게시물 신고 거절'
              #swagger.description = '게시물 신고 거절'  */

  /*  #swagger.responses[200] =  {
                  description: '게시물 신고 거절 성공',
                  schema: {   "code" : 200,
                              "message" : "게시물 신고 거절 성공" }}
      
          /*  #swagger.responses[400] = {
                  description: '게시물 신고 거절 실패',
                  schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
          ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '게시물 신고 거절 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시물 신고 처리 완료
const closeBanPost = async (req, res) => {
  /*========================================================================================================
            /* 	#swagger.tags = ['Admin: User']
                #swagger.summary = '게시물 신고 처리 완료'
                #swagger.description = '게시물 신고 처리 완료'  */

  /*  #swagger.responses[200] =  {
                    description: '게시물 신고 처리 완료 성공',
                    schema: {   "code" : 200,
                                "message" : "게시물 신고 처리 완료 성공" }}
        
            /*  #swagger.responses[400] = {
                    description: '게시물 신고 처리 완료 실패',
                    schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
            ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '게시물 신고 처리 완료 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 게시물 신고 내용 수정
const editClosedBanPost = async (req, res) => {
  /*========================================================================================================
              /* 	#swagger.tags = ['Admin: User']
                  #swagger.summary = '게시물 신고 내용 수정'
                  #swagger.description = '게시물 신고 내용 수정'  */

  /*  #swagger.responses[200] =  {
                      description: '게시물 신고 내용 수정 성공',
                      schema: {   "code" : 200,
                                  "message" : "게시물 신고 내용 수정 성공" }}
          
              /*  #swagger.responses[400] = {
                      description: '게시물 신고 내용 수정 실패',
                      schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
              ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '게시물 신고 내용 수정 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getAllBanPost,
  getOneBanPost,
  refuseBanPost,
  closeBanPost,
  editClosedBanPost,
};
