const { Op } = require('sequelize');
const { Users } = require('../../../../models');

// 짤 조회
const getImagesList = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: manage']
          #swagger.summary = '짤 조회'
          #swagger.description = '짤 조회'  */

  /*  #swagger.responses[200] =  {
              description: '짤 조회 성공',
              schema: {   "code" : 200,
                          "message" : "짤 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '짤 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '짤 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 카테고리 생성
const createCategory = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '카테고리 생성'
            #swagger.description = '카테고리 생성'  */

  /*  #swagger.responses[200] =  {
                description: '카테고리 생성 성공',
                schema: {   "code" : 200,
                            "message" : "카테고리 생성 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '카테고리 생성 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '카테고리 생성 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 카테고리 수정
const editCategory = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '카테고리 수정'
            #swagger.description = '카테고리 수정'  */

  /*  #swagger.responses[200] =  {
                description: '카테고리 수정 성공',
                schema: {   "code" : 200,
                            "message" : "카테고리 수정 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '카테고리 수정 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '카테고리 수정 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 카테고리 삭제
const deleteCategory = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '카테고리 삭제'
            #swagger.description = '카테고리 삭제'  */

  /*  #swagger.responses[200] =  {
                description: '카테고리 삭제 성공',
                schema: {   "code" : 200,
                            "message" : "카테고리 삭제 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '카테고리 삭제 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '카테고리 삭제 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 푸쉬알림 조회
const getPushList = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '푸쉬알림 조회'
            #swagger.description = '푸쉬알림 조회'  */

  /*  #swagger.responses[200] =  {
                description: '푸쉬알림 조회 성공',
                schema: {   "code" : 200,
                            "message" : "푸쉬알림 조회 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '푸쉬알림 조회 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '푸쉬알림 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 푸쉬알림 생성(전송)
const createPushList = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '푸쉬알림 생성(전송)'
            #swagger.description = '푸쉬알림 생성(전송)'  */

  /*  #swagger.responses[200] =  {
                description: '푸쉬알림 생성(전송) 성공',
                schema: {   "code" : 200,
                            "message" : "푸쉬알림 생성(전송) 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '푸쉬알림 생성(전송) 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res
      .status(200)
      .json({ code: 200, message: '푸쉬알림 생성(전송) 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 생성
const createNotice = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '공지사항 생성'
            #swagger.description = '공지사항 생성'  */

  /*  #swagger.responses[200] =  {
                description: '공지사항 생성 성공',
                schema: {   "code" : 200,
                            "message" : "공지사항 생성 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '공지사항 생성 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '공지사항 생성 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 조회
const getAllNotics = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '공지사항 조회'
            #swagger.description = '공지사항 조회'  */

  /*  #swagger.responses[200] =  {
                description: '공지사항 조회 성공',
                schema: {   "code" : 200,
                            "message" : "공지사항 조회 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '공지사항 조회 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '공지사항 조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 상세조회
const getOneNotice = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '공지사항 상세조회'
            #swagger.description = '공지사항 상세조회'  */

  /*  #swagger.responses[200] =  {
                description: '공지사항 상세조회 성공',
                schema: {   "code" : 200,
                            "message" : "공지사항 상세조회 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '공지사항 상세조회 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res
      .status(200)
      .json({ code: 200, message: '공지사항 상세조회 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 수정
const editNotice = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '공지사항 수정'
            #swagger.description = '공지사항 수정'  */

  /*  #swagger.responses[200] =  {
                description: '공지사항 수정 성공',
                schema: {   "code" : 200,
                            "message" : "공지사항 수정 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '공지사항 수정 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '공지사항 수정 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 삭제
const deleteNotice = async (req, res) => {
  /*========================================================================================================
        /* 	#swagger.tags = ['Admin: manage']
            #swagger.summary = '공지사항 삭제'
            #swagger.description = '공지사항 삭제'  */

  /*  #swagger.responses[200] =  {
                description: '공지사항 삭제 성공',
                schema: {   "code" : 200,
                            "message" : "공지사항 삭제 성공" }}
    
        /*  #swagger.responses[400] = {
                description: '공지사항 삭제 실패',
                schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
        ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // await Admins.create({ user_id });

    return res.status(200).json({ code: 200, message: '공지사항 삭제 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getImagesList,
  createCategory,
  editCategory,
  deleteCategory,
  getPushList,
  createPushList,
  createNotice,
  getAllNotics,
  getOneNotice,
  editNotice,
  deleteNotice,
};
