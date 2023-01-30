const { Op } = require('sequelize');
const {
  Users,
  UserBanLogs,
  ChatUsers,
  ChatMessages,
  Chats,
  UserSuspendLogs,
} = require('../../../../models');

// 채팅 조회
const getChatByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '채팅 조회'
          #swagger.description = '채팅 조회'  */

  /*  #swagger.responses[200] =  {
              description: '채팅 조회 성공',
              schema: {   "code" : 200,
                          "message" : "채팅 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '채팅 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { ban_id } = req.params;

    // 1. 채팅방 조회
    // 1-1. 회원 신고 로그 조회
    const ban = await UserBanLogs.findOne({
      where: { id: ban_id },
      attributes: ['user_id', 'ban_user_id'],
    });

    const user_id = ban.user_id; // 신고자
    const ban_user_id = ban.ban_user_id; // 피 신고자

    // 1-2. 신고자 채팅 방 조회
    const user_chat_list = [];
    await ChatUsers.findAll({
      where: { user_id },
      attributes: ['chat_id'],
    }).then((chats) => {
      chats.forEach((chat) => user_chat_list.push(chat.chat_id));
    });

    // 1-3. 피신고자 채팅 방 조회
    const ban_user_chat_list = [];
    await ChatUsers.findAll({
      where: { user_id: ban_user_id },
      attributes: ['chat_id'],
    }).then((chats) => {
      chats.forEach((chat) => ban_user_chat_list.push(chat.chat_id));
    });

    console.log(
      'user_chat_list: ',
      user_chat_list,
      'ban_user_chat_list: ',
      ban_user_chat_list
    );

    // 1-4. 채팅방 조회
    const chat = user_chat_list.filter((chat) =>
      ban_user_chat_list.includes(chat)
    );
    const chat_id = chat[0];

    // 2. 채팅방 메세지 조회
    const chat_message = await ChatMessages.findAll({
      where: { chat_id },
      attributes: ['id', 'user_id', 'message_type', 'message', 'created_at'],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      code: 200,
      message: '채팅 조회 성공',
      data: { ban, chat_message },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 신고된 회원 전체 조회
const getAllBanUser = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '신고된 회원 전체 조회'
          #swagger.description = '신고된 회원 전체 조회'  */

  /*  #swagger.responses[200] =  {
              description: '신고된 회원 전체 조회 성공',
              schema: {   "code" : 200,
                          "message" : "신고된 회원 전체 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '신고된 회원 전체 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { status } = req.params;

    const user_ban_list = await UserBanLogs.findAll({
      where: { status },
      attributes: ['id', 'user_id', 'ban_user_id', 'created_at'],
      include: [
        {
          model: Users,
          as: 'users',
          attributes: ['id', 'nick_name'],
        },
        {
          model: Users,
          as: 'ban_users',
          attributes: ['id', 'nick_name'],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: '신고된 회원 전체 조회 성공',
      data: { user_ban_list },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 신고 상세 조회
const getOneBanUser = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 신고 상세 조회'
          #swagger.description = '회원 신고 상세 조회'  */

  /*  #swagger.responses[200] =  {
              description: '회원 신고 상세 조회 성공',
              schema: {   "code" : 200,
                          "message" : "회원 신고 상세 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 신고 상세 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { ban_id } = req.params;
    console.log(ban_id, '===============================');

    // 1. 사용자 신고 상세 조회
    const user_ban_list = await UserBanLogs.findOne({
      where: { id: ban_id },
      attributes: ['id', 'user_id', 'ban_user_id', 'created_at', 'reason'],
      include: [
        {
          model: Users,
          as: 'users',
          attributes: ['id', 'nick_name'],
        },
        {
          model: Users,
          as: 'ban_users',
          attributes: ['id', 'nick_name', 'email'],
        },
      ],
    });

    // 2. 신고자의 누적 신고 건 조회
    const old_ban_list = await UserBanLogs.findOne({
      where: { user_id: user_ban_list.user_id },
      attributes: ['id', 'created_at', 'reason', 'status', 'completed_reason'],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Users,
          as: 'ban_users',
          attributes: ['id'],
          include: [
            {
              model: UserSuspendLogs,
              as: 'user_suspend_logs',
              // attributes: ['days', 'reason'],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      message: '회원 신고 상세 조회 성공',
      data: { user_ban_list, old_ban_list },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 신고 거절
const refuseBanUser = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 신고 거절'
          #swagger.description = '회원 신고 거절'  */

  /*  #swagger.responses[200] =  {
              description: '회원 신고 거절 성공',
              schema: {   "code" : 200,
                          "message" : "회원 신고 거절 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 신고 거절 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res.status(200).json({ code: 200, message: '회원 신고 거절 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 신고 처리 완료
const closeBanUser = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 신고 처리 완료'
          #swagger.description = '회원 신고 처리 완료'  */

  /*  #swagger.responses[200] =  {
              description: '회원 신고 처리 완료 성공',
              schema: {   "code" : 200,
                          "message" : "회원 신고 처리 완료 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 신고 처리 완료 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '회원 신고 처리 완료 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 신고 내용 수정
const editClosedBanUser = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 신고 내용 수정'
          #swagger.description = '회원 신고 내용 수정'  */

  /*  #swagger.responses[200] =  {
              description: '회원 신고 내용 수정 성공',
              schema: {   "code" : 200,
                          "message" : "회원 신고 내용 수정 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 신고 내용 수정 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res
      .status(200)
      .json({ code: 200, message: '회원 신고 내용 수정 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getChatByAdmin,
  getAllBanUser,
  getOneBanUser,
  refuseBanUser,
  closeBanUser,
  editClosedBanUser,
};
