const { dayjsTime } = require('../../../../src/dayjsTime');
const { Op } = require('sequelize');
const {
  Users,
  UserCars,
  Carpools,
  Communities,
  CarpoolUsers,
  CarpoolLikes,
  CommunityLikes,
  CarpoolCancels,
  Reviews,
} = require('../../../../models');

// let appDir = path.dirname(require.main.filename);
// const upload = require('../S3/s3');

// 마이페이지 조회
const getMypage = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Main']
        #swagger.summary = '마이페이지 조회'
        #swagger.description = '마이페이지 조회'
    /*  #swagger.responses[200] =  {  
            description: '마이페이지 조회 성공',
            schema: {   "code" : 200,
                        "message" : "마이페이지 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_main/mypage' }}}
    /*  #swagger.responses[400] = { 
            description: '마이페이지 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    // 1-1. 작성 게시글 조회
    let carpool_list = [];
    await Carpools.findAll({ where: { user_id } }).then((carpools) => {
      if (carpools) {
        for (carpool of carpools) {
          carpool_list.push(carpool.id);
        }
      }
    });

    let community_list = [];
    await Communities.findAll({ where: { user_id } }).then((communities) => {
      if (communities) {
        for (community of communities) {
          community_list.push(community.id);
        }
      }
    });

    // 1-2. 이용내역 조회
    // 매칭테이블에서 회원이 포함된 매칭 ID 조회
    const matches = await CarpoolUsers.findAll({
      where: {
        [Op.and]: [{ user_id: user_id }],
      },
    });

    // 1-3. 찜 조회
    const likes = await CarpoolLikes.findAll({
      where: { user_id },
    });

    // 1-4. 작성글/ 이용 내역/ 찜 정리
    const count = {
      carpool_count: carpool_list.length + community_list.length,
      match_count: matches.length,
      likes_count: likes.length,
    };

    // 2. 인증 조회
    const auth_list = { certi1: '작업중...' };

    // 3. 차 소유 유뮤 조회
    let car = { have_car: true };
    await UserCars.findOne({
      where: { user_id },
    }).then((user_car) => {
      if (!user_car) {
        car.have_car = false;
      }
    });

    // 4. 정산 월/ 정산금액 조회 (보류) <--------------------------------------------------------정산 테이블 생성 및 작업 필요
    const wage = { wage_date: '2022-02', wage_payment: 200000 };

    return res.status(200).json({
      code: 200,
      message: '마이페이지 조회 성공',
      data: { user, count, auth_list, car, wage },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 프로필 수정
const editProfile = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Main']
        #swagger.summary = '프로필 수정'
        #swagger.description = '프로필 수정'

    /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Mypage_main/edit_profile'  }}

    /*  #swagger.responses[200] =  {  
            description: '프로필 수정 성공',
            schema: {   "code" : 200, 
                        "message" : "프로필 수정 성공"}}
                        
    /*  #swagger.responses[400] = { 
            description: '프로필 수정 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const { profile_image_url, nick_name, is_smoke, gender } = req.body;

    await Users.update(
      { profile_image_url, nick_name, is_smoke, gender },
      { where: { id: user.id } }
    );

    return res.status(200).json({ code: 200, message: '프로필 수정 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 작성 글 조회
const getMyPost = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Main']
        #swagger.summary = '작성 글 조회'
        #swagger.description = '작성 글 조회'

    /*  #swagger.parameters['Type'] = {  
            in: 'query',
            name: 'type',
            description: '카풀게시판: 카풀 탈래요(rider)/ 타세요(driver) | 낙서장: 자유(free)',
            type: 'string'} 

    /*  #swagger.parameters['Status'] = {  
            in: 'query',
            name: 'status',
            description: '상태: 전체(all)/ 매칭전(request)/ 매칭완료(complete)',
            type: 'string'} 

    /*  #swagger.parameters['Page'] = {  
            in: 'query',
            name: 'page',
            description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
            type: 'integer'} 

    /*  #swagger.responses[200] =  {  
            description: '작성 글 조회 성공',
            schema: {   "code" : 200,
                        "message" : "작성 글 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_main/carpool_list' }}}
                        
    /*  #swagger.responses[400] = { 
            description: '작성 글 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category } = req.params;
    const { type, status, page } = req.query;

    const postPage = !page ? 0 : page;

    let status_list = [];
    status_list = status == 'all' ? ['request', 'complete'] : status;

    let post_list;
    // 1. 카풀 게시글인 경우
    if (category == 'carpool') {
      // 1. type 또는 status 값이 있는 경우
      if (type || status) {
        console.log(1);
        post_list = await Carpools.findAll({
          where: {
            [Op.and]: [
              { user_id },
              { is_hidden: false },
              { type: type || ['driver', 'rider'] },
            ],
            [Op.or]: [{ status: status_list || ['request', 'complete'] }],
          },
          attributes: [
            'id',
            'user_id',
            'status',
            'type',
            'kind',
            'title',
            'start_address',
            'start_latitude',
            'start_longitude',
            'arrive_address',
            'arrive_latitude',
            'arrive_longitude',
            'start_date',
            'content',
            'price',
            'image_url',
            'is_hidden',
            'view_count',
            'created_at',
            'updated_at',
          ],
          order: [['created_at', 'DESC']],
          limit: 20,
          offset: postPage * 20,
        });
      }

      // 2. type 또는 status 값이 없는 경우
      if (!type && !status) {
        console.log(2);
        post_list = await Carpools.findAll({
          where: { user_id },
          attributes: [
            'id',
            'user_id',
            'status',
            'type',
            'kind',
            'title',
            'start_address',
            'start_latitude',
            'start_longitude',
            'arrive_address',
            'arrive_latitude',
            'arrive_longitude',
            'start_date',
            'content',
            'price',
            'image_url',
            'is_hidden',
            'view_count',
            'created_at',
            'updated_at',
          ],
          order: [['created_at', 'DESC']],
          limit: 20,
          offset: postPage * 20,
        });
      }
    }

    // 2. 커뮤니티 게시글인 경우
    if (category == 'community') {
      post_list = await Communities.findAll({
        where: {
          [Op.and]: [
            { user_id },
            { is_hidden: false },
            { type: type || 'free' },
          ],
        },
        attributes: [
          'id',
          'user_id',
          'type',
          'title',
          'content',
          'image_url',
          'is_hidden',
          'view_count',
          'created_at',
          'updated_at',
        ],
        order: [['created_at', 'DESC']],
        limit: 20,
        offset: postPage * 20,
      });
    }

    return res.status(200).json({
      code: 200,
      message: '작성 글 조회 성공',
      data: { post_list },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 이용 내역 조회
const getMyHistory = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Main']
        #swagger.summary = '이용 내역 조회 '
        #swagger.description = '이용 내역 조회 '

    /*  #swagger.parameters['Mypage Type'] = {  
            in: 'query',
            name: 'type',
            description: '카풀 탈래요(rider)/ 타세요(driver)',
            type: 'string'} 

    /*  #swagger.parameters['Page'] = {  
            in: 'query',
            name: 'page',
            description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
            type: 'integer'} 

    /*  #swagger.responses[200] =  {  
            description: '이용 내역 조회 성공',
            schema: {   "code" : 200,
                        "message" : "이용 내역 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_main/carpool_history' }}}
    /*  #swagger.responses[400] = { 
            description: '이용 내역 조회  실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { type, page } = req.query;

    const postPage = !page ? 0 : page;

    // 2. 회원 게시물 조회
    let temp_carpool_id_list = [];
    await Carpools.findAll({
      where: { user_id },
      attributes: ['id'],
    }).then((carpools) => {
      for (carpool of carpools) {
        temp_carpool_id_list.push(carpool.id);
      }
    });

    console.log('회원 게시물 조회: ', temp_carpool_id_list);

    // 1. 회원과 매칭된 게시글 조회
    let carpool_id_list = [];
    await CarpoolUsers.findAll({
      where: { [Op.or]: [{ user_id }, { carpool_id: temp_carpool_id_list }] },
      attributes: ['carpool_id'],
    }).then((carpool_users) => {
      for (carpool_user of carpool_users) {
        carpool_id_list.push(carpool_user.carpool_id);
      }
    });

    console.log('회원과 매칭된 게시물 조회: ', carpool_id_list);

    // 1. type이 없는 경우 (초기화면)
    let carpool_list;
    if (!type) {
      console.log('type이 없는 경우');
      carpool_list = await CarpoolUsers.findAll({
        where: {
          [Op.or]: [{ carpool_id: carpool_id_list }],
        },
        attributes: ['id', 'created_at'],
        include: [
          {
            model: Carpools,
            as: 'carpools',
            where: { [Op.or]: [{ type: ['rider', 'driver'] }] },
            attributes: [
              'id',
              'user_id',
              'status',
              'type',
              'kind',
              'title',
              'start_address',
              'start_latitude',
              'start_longitude',
              'arrive_address',
              'arrive_latitude',
              'arrive_longitude',
              'start_date',
              'content',
              'price',
              'image_url',
              'is_hidden',
              'view_count',
              'created_at',
              'updated_at',
            ],
            include: [
              {
                model: Users,
                as: 'users',
                attributes: ['id'],
              },
            ],
          },
          {
            model: CarpoolCancels,
            as: 'carpool_cancels',
            // attributes: ['id', 'carpool_user_id'],
          },
        ],
        order: [['id', 'DESC']], // 결제가 완료된 날짜가 기준이 되야함.
        limit: 20,
        offset: postPage * 20,
      });
    } else {
      // 2. type이 있는 경우
      console.log(type);
      carpool_list = await CarpoolUsers.findAll({
        where: {
          [Op.or]: [{ carpool_id: carpool_id_list }],
        },
        attributes: ['id'],
        include: [
          {
            model: Carpools,
            as: 'carpools',
            where: { type },
            include: [
              {
                model: Users,
                as: 'users',
                attributes: ['id'],
              },
              {
                model: Reviews,
                as: 'reviews',
                attributes: ['id'],
              },
            ],
          },
          {
            model: CarpoolCancels,
            as: 'carpool_cancels',
            attributes: ['id'],
          },
        ],
        order: [['created_at', 'DESC']], // 결제가 완료된 날짜가 기준이 되야함.
        limit: 20,
        offset: postPage * 20,
      });
    }

    return res.status(200).json({
      code: 200,
      message: '이용 내역 조회  성공',
      data: { user, carpool_list },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 이용 내역 > 카풀 이용자 취소 요청/취소
const cancelCarpool = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Main']
        #swagger.summary = '이용 내역 > 카풀 취소 요청'
        #swagger.description = '이용 내역 > 카풀 취소 요청'

     /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/Mypage_main/cancle_carpool'  }}

    /*  #swagger.responses[200] =  {  
            description: '이용 내역 > 카풀 취소 요청 성공',
            schema: {   "code" : 200,
                        "message" : "이용 내역 > 카풀 취소 요청 성공"}}
    /*  #swagger.responses[400] = { 
            description: '이용 내역 > 카풀 취소 요청 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { carpool_user_id } = req.params;
    const { status, type } = req.body;
    const now = await dayjsTime();

    // 1. 작성자 조회
    const carpool_user = await CarpoolUsers.findByPk(carpool_user_id);
    const post = await Carpools.findOne({
      where: { id: carpool_user.carpool_id },
    });
    const writer_id = post.user_id;

    // 현재 취소 상태 조회
    await CarpoolCancels.findOne({
      where: { carpool_user_id, status, type },
    }).then((cancel) => {
      if (cancel != null) {
        throw new Error('이미 취소 상태가 변경되었습니다.');
      }
    });

    console.log(
      'user_id, 접속한 회원:',
      user_id,
      'carpool_user.user_id 이용자: ',
      carpool_user.user_id,
      'writer_id 작성자: ',
      writer_id
    );
    // 2. 이용자가 취소/철회 하는 경우
    if (user_id == carpool_user.user_id) {
      console.log('이용자가 취소 절차 중입니다.');
      // 2-1. 이용자의 취소 요청
      if (status == 'request') {
        await CarpoolCancels.findOne({ where: { carpool_user_id } }).then(
          (cancel) => {
            if (!cancel) {
              CarpoolCancels.create({
                carpool_user_id,
                type,
                status,
                request_at: now,
              });

              return res.status(200).json({
                code: 200,
                message: '이용 내역 > 카풀 취소 요청 성공',
              });
            }

            // [오류] 취소철회 / 취소 동의 후 재요청 하는경우
            if (
              cancel.status == 'fail_by_user' ||
              cancel.status == 'fail_by_writer'
            ) {
              throw new Error('취소처리가 끝난 경우 재요청 할 수 없습니다.');
            }
          }
        );
      }

      // 2-2. 이용자의 취소 철회
      if (status == 'fail_by_user') {
        console.log('이용자 취소 철회중');
        await CarpoolCancels.findOne({ where: { carpool_user_id } }).then(
          (cancel) => {
            if (cancel.status == 'request') {
              CarpoolCancels.update(
                {
                  status,
                  fail_at: now,
                },
                { where: { carpool_user_id } }
              );

              return res.status(200).json({
                code: 200,
                message: '이용 내역 > 카풀 취소 철회 성공',
              });
            }

            // [오류] 취소 동의 / 게시자 취소 철회된 경우
            if (
              cancel.status == 'accept_request' ||
              cancel.status == 'fail_by_writer'
            ) {
              throw new Error('취소처리가 이미 끝났습니다.');
            }
          }
        );
      }

      // [오류] 이용자가 게시자의 권한 사용시
      if (status == 'accept_request' || status == 'fail_by_writer') {
        throw new Error('게시자 권한입니다.');
      }
    }

    // 3. 게시자가 취소/철회 하는 경우
    if (user_id == writer_id) {
      console.log('게시자가 취소 절차 중입니다.');
      // 3-1. 게시자가 취소 동의하는 경우
      if (status == 'accept_request') {
        await CarpoolCancels.findOne({ where: { carpool_user_id } }).then(
          (cancel) => {
            // 취소 요청의 경우 취소 동의
            if (cancel.status == 'request') {
              CarpoolCancels.update(
                {
                  status,
                  accept_at: now,
                },
                { where: { carpool_user_id } }
              );

              return res.status(200).json({
                code: 200,
                message: '이용 내역 > 카풀 취소 동의 성공',
              });
            }
            // [오류] 이용자가 이미 취소 철회한 경우
            if (cancel.status == 'fail_by_user') {
              throw new Error('이용자가 취소를 철회했습니다.');
            }

            // [오류] 게시자마 이미 취소 철회한 경우
            if (cancel.status == 'fail_by_writer') {
              throw new Error('이미 취소 철회되었습니다.');
            }
          }
        );
      }

      // 3-2. 게시자가 취소 철회하는 경우
      if (status == 'fail_by_writer') {
        await CarpoolCancels.findOne({ where: { carpool_user_id } }).then(
          (cancel) => {
            // 취소 요청의 경우 취소 철회
            if (cancel.status == 'request') {
              CarpoolCancels.update(
                {
                  status,
                  fail_at: now,
                },
                { where: { carpool_user_id } }
              );

              return res.status(200).json({
                code: 200,
                message: '이용 내역 > 카풀 취소 철회 성공',
              });
            }

            // [오류] 게시자가 이미 취소 동의한 경우
            if (cancel.status == 'accept_request') {
              throw new Error('이미 취소 동의되었습니다.');
            }

            // [오류] 이용자가 이미 취소 철회한 경우
            if (cancel.status == 'fail_by_user') {
              throw new Error('이용자가 취소를 철회했습니다.');
            }
          }
        );
      }

      // [오류] 게시자가 이용자 권한 사용시
      if (status == 'request' || status == 'fail_by_user') {
        throw new Error('이용자 권한입니다.');
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 찜 조회
const getMyLike = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Main']
        #swagger.summary = '찜 조회'
        #swagger.description = '찜 조회'

    /*  #swagger.parameters['Mypage Type'] = {  
            in: 'query',
            name: 'type',
            description: '카풀 탈래요(rider)/ 타세요(driver)',
            type: 'string'} 

    /*  #swagger.parameters['Mypage_like'] = {  
            in: 'query',
            name: 'status',
            description: '상태: 전체(all)/ 매칭전(request)/ 매칭완료(complete)',
            type: 'string'} 

    /*  #swagger.parameters['Page'] = {  
            in: 'query',
            name: 'page',
            description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
            type: 'integer'} 

    /*  #swagger.responses[200] =  {  
            description: '찜 조회 성공',
            schema: {   "code" : 200,
                        "message" : "찜 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_main/carpool_list' }}}
                       
    /*  #swagger.responses[400] = { 
            description: '찜 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { category } = req.params;
    const { type, status, page } = req.query;

    console.log(type, status);

    const postPage = !page ? 0 : page;

    // 1. 카풀 게시물인 경우
    if (category == 'carpool') {
      console.log('카풀 게시물인 경우');
      let status_list = [];
      status_list = status == 'all' ? ['request', 'complete'] : status;

      // 1. 회원 게시물 조회
      const carpool_list = await CarpoolLikes.findAll({
        where: {
          user_id,
        },
        attributes: ['id', 'created_at', 'updated_at'],
        include: [
          {
            model: Carpools,
            as: 'carpools',
            where: {
              [Op.and]: [
                { type: type || 'rider' },
                { status: status_list || ['request', 'complete'] },
              ],
            },
            attributes: [
              'id',
              'user_id',
              'status',
              'type',
              'kind',
              'title',
              'start_address',
              'start_latitude',
              'start_longitude',
              'arrive_address',
              'arrive_latitude',
              'arrive_longitude',
              'start_date',
              'content',
              'price',
              'image_url',
              'is_hidden',
              'view_count',
              'created_at',
              'updated_at',
            ],
          },
        ],
        order: [['created_at', 'DESC']],
        limit: 20,
        offset: postPage * 20,
      });

      return res.status(200).json({
        code: 200,
        message: '찜 조회 성공',
        data: { user, carpool_list },
      });
    }

    // 1. 낙서장 게시물인 경우
    if (category == 'community') {
      console.log('낙서장 게시물인 경우');
      const community_list = await CommunityLikes.findAll({
        where: {
          user_id,
        },
        attributes: ['id', 'created_at', 'updated_at'],
        include: [
          {
            model: Communities,
            as: 'communities',
            where: {
              [Op.and]: [{ type: type || 'free' }],
            },
            attributes: [
              'id',
              'user_id',
              'type',
              'title',
              'content',
              'image_url',
              'is_hidden',
              'view_count',
              'created_at',
              'updated_at',
            ],
          },
          {
            model: Users,
            as: 'users',
            attributes: ['id', 'nick_name', 'profile_image_url'],
          },
        ],
        order: [['created_at', 'DESC']],
        limit: 20,
        offset: postPage * 20,
      });

      return res.status(200).json({
        code: 200,
        message: '찜 조회 성공',
        data: { user, community_list },
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getMypage,
  editProfile,
  getMyPost,
  getMyHistory,
  cancelCarpool,
  getMyLike,
};
