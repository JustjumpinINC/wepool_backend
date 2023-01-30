const { Op } = require('sequelize');
const {
  Users,
  Carpools,
  Communities,
  Notices,
  ContactUs,
  Admins,
  Services,
  CarpoolLikes,
  CommunityLikes,
} = require('../../../../models');

// 찜 알림 조회
const getLikeAlarm = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '알림 조회'
        #swagger.description = '알림 조회'

    /*  #swagger.responses[200] =  {  
            description: '알림 조회 성공',
            schema: {   "code" : 200, 
                        "message" : "알림 조회 성공",
                        "data": { $ref: '#/components/schemas/Mypage_setting/get_alarm' }}}
                        
    /*  #swagger.responses[400] = { 
            description: '알림 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    let alarm_list;
    let carpool_alarm_list;
    let community_alarm_list;

    // 1. 회원 카풀 게시글 모두 조회
    let carpool_list = [];
    await Carpools.findAll({
      where: { user_id },
    }).then((carpools) => {
      for (carpool of carpools) {
        carpool_list.push(carpool.id);
      }
    });

    // console.log('carpool_list: ', carpool_list);

    // 1-1. 카풀 찜 알람 OFF인 경우 => 빈 칸 전달
    console.log('is_carpool_push: ', user.is_carpool_push);
    if (user.is_carpool_push == false) {
      carpool_alarm_list = [];
      // console.log('carpool_alarm_list: ', carpool_alarm_list);
    } else {
      // 1-2. 카풀 찜 알람 ON인 경우 => 카풀 찜 알람 조회
      carpool_alarm_list = await CarpoolLikes.findAll({
        where: {
          [Op.or]: { carpool_id: carpool_list },
          [Op.and]: { is_checked: false },
        },
        attributes: ['id'],
        include: [
          {
            model: Users,
            as: 'users',
            attributes: ['id', 'nick_name', 'profile_image_url'],
          },
          {
            model: Carpools,
            as: 'carpools',
            where: { is_hidden: false },
            attributes: ['title'],
          },
        ],
        order: [['created_at', 'DESC']],
      });
    }

    // 2. 회원 커뮤니티 게시글 모두 조회
    let community_list = [];
    await Communities.findAll({
      where: { user_id },
    }).then((communities) => {
      for (community of communities) {
        community_list.push(community.id);
      }
    });

    console.log('community_list :', community_list);

    // 2-1. 커뮤니티 찜 알람 OFF인 경우 => 빈 칸 전달
    if (user.is_community_push == false) {
      community_alarm_list = [];
    } else {
      // 2-2. 커뮤니티 찜 알람 ON인 경우 => 커뮤니티 찜 알람 조회
      community_alarm_list = await CommunityLikes.findAll({
        where: {
          [Op.or]: { community_id: community_list },
          [Op.and]: { is_checked: false },
        },
        attributes: ['id'],
        include: [
          {
            model: Users,
            as: 'users',
            attributes: ['id', 'nick_name', 'profile_image_url'],
          },
          {
            model: Communities,
            as: 'communities',
            where: { is_hidden: false },
            attributes: ['title'],
          },
        ],
        order: [['created_at', 'DESC']],
      });
    }

    console.log(
      'community_alarm_list :',
      community_alarm_list,
      'carpool_alarm_list : ',
      carpool_alarm_list
    );
    alarm_list = carpool_alarm_list.concat(community_alarm_list);

    // 3. 알림 읽음 표시
    await CarpoolLikes.update(
      { is_checked: true },
      {
        where: {
          [Op.or]: { carpool_id: carpool_list },
          [Op.and]: { is_checked: false },
        },
      }
    );
    await CommunityLikes.update(
      { is_checked: true },
      {
        where: {
          [Op.or]: { community_id: community_list },
          [Op.and]: { is_checked: false },
        },
      }
    );

    return res.status(200).json({
      code: 200,
      message: '알림 조회 성공',
      data: { user, alarm_list },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 알림 설정 수정
const editAlarm = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '알림 설정 수정'
        #swagger.description = '알림 설정 수정 (type: chat / carpool)'

    /*  #swagger.responses[200] =  {  
            description: '알림 설정 수정 성공',
            schema: {   "code" : 200, "message" : "알림 설정 수정 성공" }}
                        
    /*  #swagger.responses[400] = { 
            description: '알림 설정 수정 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    let { type } = req.params;

    // type = 'chat' / 'carpopl' / 'community'
    // 1. 프론트와 약속
    const alarmType = {
      chat: 'is_chat_push',
      carpool: 'is_carpool_push',
      community: 'is_community_push',
    };

    // 2. 회원 조회
    const userInfo = await Users.findByPk(user_id);
    // 2-1. 채팅 알람의 경우
    if (alarmType[type] == 'is_chat_push') {
      userInfo.set({
        is_chat_push: !userInfo.is_chat_push,
      });
    }

    // 2-2. 카풀 찜 알람의 경우
    if (alarmType[type] == 'is_carpool_push') {
      userInfo.set({
        is_carpool_push: !userInfo.is_carpool_push,
      });
    }

    // 2-3. 커뮤니티 찜 알람의 경우
    if (alarmType[type] == 'is_community_push') {
      userInfo.set({
        is_community_push: !userInfo.is_community_push,
      });
    }

    // 3. 변경사항 저장
    await userInfo.save();

    return res.status(200).json({ code: 200, message: '알림 설정 수정 성공' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 조회
const getNotice = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '공지사항 조회'
        #swagger.description = '공지사항 조회'

    /*  #swagger.responses[200] =  {  
            description: '공지사항 조회 성공',
            schema: {   "code" : 200,
                        "message" : "공지사항 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_setting/notice_list' }}}

    /*  #swagger.responses[400] = { 
            description: '공지사항 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const notices = await Notices.findAll({
      attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
    });

    return res
      .status(200)
      .json({ code: 200, message: '공지사항 조회 성공', data: { notices } });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 조회_자세히
const getOneNotice = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '공지사항 조회_자세히'
        #swagger.description = '공지사항 조회_자세히'

    /*  #swagger.responses[200] =  {  
            description: '공지사항 조회 성공',
            schema: {   "code" : 200,
                        "message" : "공지사항 조회 성공",        
                        "data": { $ref: '#/components/schemas/Mypage_setting/notice' }}}

    /*  #swagger.responses[400] = { 
            description: '공지사항 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const { notice_id } = req.params;

    const notice = await Notices.findOne({
      where: { id: notice_id },
      attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
    });

    return res
      .status(200)
      .json({ code: 200, message: '공지사항 조회 성공', data: { notice } });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 작성
const createNotice = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '공지사항 작성'
        #swagger.description = '공지사항 작성'

    /*  #swagger.responses[200] =  {  
            description: '공지사항 작성 성공',
            schema: {   "code" : 200,
                        "message" : "공지사항 작성 성공"}}

    /*  #swagger.responses[400] = { 
            description: '공지사항 작성 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { title, content } = req.body;

    // 1. 관리자 확인
    const admin = await Admins.findOne({ user_id });

    if (!admin) {
      throw new Error('관리자가 아닙니다.');
    }

    // 2. 공지사항 작성
    const existNotice = await Notices.findAll({
      where: { title, content },
    }).then((notice) => {
      if (notice.length > 0) {
        throw new Error('중복된 공지사항이 있습니다.');
      }
    });
    const notice = await Notices.create({ title, content });

    return res.status(200).json({ code: 200, message: '공지사항 작성 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 공지사항 수정
const editNotice = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '공지사항 수정'
        #swagger.description = '공지사항 수정'

    /*  #swagger.responses[200] =  {  
            description: '공지사항 수정 성공',
            schema: {   "code" : 200,
                        "message" : "공지사항 수정 성공" }}

    /*  #swagger.responses[400] = { 
            description: '공지사항 수정 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { notice_id } = req.params;
    const { title, content } = req.body;

    // 1. 관리자 확인
    const admin = await Admins.findOne({ where: { user_id } });

    if (!admin) {
      throw new Error('관리자가 아닙니다.');
    }

    // 2. 공지사항 수정
    const notice = await Notices.update(
      { title, content },
      { where: { id: notice_id } }
    );

    return res.status(200).json({ code: 200, message: '공지사항 수정 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 문의하기 조회
const getContactUs = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '문의하기 조회'
        #swagger.description = '문의하기 조회'

    /*  #swagger.responses[200] =  {  
            description: '문의하기 조회 성공',
            schema: {   "code" : 200, 
                        "message" : "문의하기 조회 성공",
                        "data": { $ref: '#/components/schemas/Mypage_setting/contact_us' }}}
                        
    /*  #swagger.responses[400] = { 
            description: '문의하기 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const contact = await ContactUs.findAll({
      attributes: ['id', 'type', 'info', 'created_at', 'updated_at'],
    });

    return res.status(200).json({
      code: 200,
      message: '문의하기 조회 성공',
      data: { contact_info: contact },
    });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 문의하기 수정
const editContactUs = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '문의하기 조회'
        #swagger.description = '문의하기 조회'

    /*	#swagger.parameters['payload'] = {
          in: 'body',
          description: 'Request Body',
          required: true,
          schema: {   $ref: '#/components/schemas/Mypage_setting/edit_contact_us'  }} 

    /*  #swagger.responses[200] =  {  
            description: '문의하기 조회 성공',
            schema: {   "code" : 200, 
                        "message" : "문의하기 수정 성공" }}
                        
    /*  #swagger.responses[400] = { 
            description: '문의하기 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { type } = req.params;
    const { info } = req.body;

    // 1. 관리자 확인
    const admin = await Admins.findOne({ user_id });

    if (!admin) {
      throw new Error('관리자가 아닙니다.');
    }

    // 2. 문의하기 수정
    await ContactUs.update({ info }, { where: { type } });

    return res.status(200).json({ code: 200, message: '문의하기 수정 성공' });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 서비스 약관 조회
const getService = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '서비스 약관 조회'
        #swagger.description = '서비스 약관 조회'

    /*  #swagger.responses[200] =  {  
            description: '서비스 약관 조회 성공',
            schema: {   "code" : 200, 
                        "message" : "문의하기 수정 성공", 
                         "data": { $ref: '#/components/schemas/Mypage_setting/get_service' }}}
                        
    /*  #swagger.responses[400] = { 
            description: '서비스 약관 조회 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const service = await Services.findAll({
      attributes: ['id', 'title', 'created_at', 'updated_at'],
    });

    return res
      .status(200)
      .json({ code: 200, message: '서비스 약관 조회 성공', date: { service } });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 서비스 약관 조회_자세히
const getOneService = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Mypage - Setting']
        #swagger.summary = '서비스 약관 조회_자세히'
        #swagger.description = '서비스 약관 조회_자세히'
 
    /*  #swagger.responses[200] =  {  
            description: '서비스 약관 조회_자세히 성공',
            schema: {   "code" : 200, 
                        "message" : "문의하기 수정 성공" }}
                        
    /*  #swagger.responses[400] = { 
            description: '서비스 약관 조회_자세히 실패',
            schema: {  "code" : 400, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/
  try {
    const { service_id } = req.params;
    const service = await Services.findOne({
      where: { id: service_id },
      attributes: ['id', 'title', 'content', 'created_at', 'updated_at'],
    });

    return res.status(200).json({
      code: 200,
      message: '서비스 약관 조회_자세히 성공',
      date: { service },
    });
  } catch (error) {
    // console.log(error)
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getLikeAlarm,
  editAlarm,
  getNotice,
  getOneNotice,
  createNotice,
  editNotice,
  getContactUs,
  editContactUs,
  getService,
  getOneService,
};
