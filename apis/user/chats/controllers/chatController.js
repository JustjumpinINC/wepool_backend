const { Op } = require('sequelize');
const {
  Carpools,
  Chats,
  ChatUsers,
  Users,
  UserBanLogs,
  ChatMessages,
  sequelize,
} = require('../../../../models');

const { dayjsTime } = require('../../../../src/dayjsTime'); // 시간 설정
const now = dayjsTime();

// 채팅 목록 조회
const getChat = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Chat']
          #swagger.summary = '채팅 목록 조회'
          #swagger.description = '채팅 목록 조회' */

  /*  #swagger.responses[200] =  {  
              description: '채팅 목록 조회 성공',
              schema: {   "code" : 200, 
                          "message" : "채팅 목록 조회 성공",
                          "data": { $ref: '#/components/schemas/Chat/get_chat' }}}
  
      /*  #swagger.responses[400] = { 
              description: '채팅 목록 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
  
      ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;

    // 1. 블럭한 회원 조회
    let block_user_id_list = [];
    await UserBanLogs.findAll({
      where: { user_id },
      attributes: ['ban_user_id'],
    }).then((blockUsers) => {
      for (blockUser of blockUsers) {
        block_user_id_list.push(blockUser.ban_user_id);
      }
    });

    // 1-1. 블럭한 회원 채팅방 조회
    let block_chat_id_list = [];
    await ChatUsers.findAll({
      where: { user_id: block_user_id_list },
    }).then((blockChats) => {
      for (blockChat of blockChats) {
        block_chat_id_list.push(blockChat.chat_id);
      }
    });
    console.log('블럭한 회원 채팅방 조회: ', block_chat_id_list);

    // 2. 회원 채팅방 조회
    let chat_id_list = [];
    await ChatUsers.findAll({
      where: { user_id },
    }).then((chats) => {
      for (chat of chats) {
        chat_id_list.push(chat.chat_id);
      }
    });
    console.log('회원 채팅방 조회: ', chat_id_list);

    // 2-1. 채팅방 조회 =  회워 채팅방 - 블럭한 회원 채팅방
    const filtered_chat_id_list = chat_id_list.filter(
      (chat) => !block_chat_id_list.includes(chat)
    );
    console.log('채팅방 조회: ', filtered_chat_id_list);

    // 3. 채팅방, 상대방 조회
    let chat_list = [];
    for (chat_id of filtered_chat_id_list) {
      // 3-1. 채팅방 정보 조회
      const chat_info = await ChatUsers.findOne({
        where: { [Op.and]: { chat_id: chat_id }, [Op.not]: { user_id } },
      });

      // 3-2. 채팅 마지막 메세지 조회
      const chat_message = await ChatMessages.findAll({
        where: { chat_id: chat_id },
        order: [['created_at', 'DESC']],
        limit: 1,
      });

      // 3-3. 채팅 읽지 않은 메세지 조회
      const unread_message = await ChatMessages.findAll({
        where: { chat_id: chat_id, is_checked: false },
      });

      // 3-4. 채팅 상대방 조회
      const chat_user = await Users.findAll({
        where: { id: chat_info.user_id },
      });

      chat_list.push({
        chat_info,
        chat_message,
        unread_message: unread_message.length,
        chat_user,
      });
    }

    chat_list.sort(
      (a, b) => a.chat_message[0].createdAt - b.chat_message[0].createdAt
    );

    // 고려 사항 ------------------->
    // 1. 마지막 메세지가 보일 것. (OK)
    // 2. 읽지 않는 메세지의 갯수가 보일 것.  (OK)
    // 3. 회원이 블락한 채팅은 보이지 않게 할 것.  (OK)
    // 4. 메세지의 순서는 채팅 순서로 보여지게 할 것.  (OK)

    //<-------------------------------

    return res.status(200).json({
      code: 200,
      message: '채팅 목록 조회 성공',
      data: { user, chat_list },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 채팅 시작
const startChat = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Chat']
          #swagger.summary = '채팅 시작'
          #swagger.description = '채팅 시작' */

  /*  #swagger.parameters['Page'] = {  
              in: 'query',
              name: 'page',
              description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
              type: 'integer'} 

      /*  #swagger.responses[200] =  {  
              description: '채팅 시작 성공',
              schema: {   "code" : 200, "message" : "채팅 시작 성공" }}
  
      /*  #swagger.responses[400] = { 
              description: '채팅 시작 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
  
      ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { carpool_id } = req.params;
    const { page } = req.query;
    const postPage = !page ? 0 : page;

    // 1. 게시물 작성자 조회
    const carpool = await Carpools.findByPk(carpool_id);

    let users = [user_id, carpool.user_id];

    // [오류] 게시물 작성자가 본인인 경우
    if (user_id == carpool.user_id) {
      throw new Error('본인과는 채팅할 수 없습니다.');
    }

    // 2. 회원 채팅 ID 조회
    let chat_list = [];
    await ChatUsers.findAll({
      where: {
        user_id,
        is_join: true,
      },
      attributes: ['chat_id'],
    }).then((chats) => {
      for (chat of chats) {
        chat_list.push(chat.chat_id);
      }
    });

    // 2-1. 게시물 작성자와 채팅 조회
    const chat_user = await ChatUsers.findOne({
      where: {
        [Op.or]: { chat_id: chat_list },
        [Op.and]: { user_id: carpool.user_id },
      },
    });

    // 3. 채팅방이 없는 경우, 생성
    if (!chat_user) {
      console.log('채팅방이 없는 경우');

      const newChat = await Chats.create({});
      const chat_id = newChat.id;

      console.log(newChat, newChat.dataValues.id, newChat.id);

      let values = [];
      users.forEach((user) => {
        values.push({ user_id: user, chat_id });
      });
      console.log(users);
      console.log(values);

      await ChatUsers.bulkCreate(values, { returning: true });

      // // 테스트 (삭제 예정) ---------------->
      // await ChatMessages.create({
      //   chat_id: newChat.id,
      //   user_id,
      //   message_type: 'message',
      //   message: '채팅방이 원래 있던데요?',
      // });
      // console.log('새로운 채팅방 생성');
      // console.log('채팅방 ID: ', newChat.id, '상대방 ID: ', carpool.user_id);
      // <---------------------------------------

      return res.status(200).json({
        code: 200,
        message: '채팅 시작 성공',
        data: { user, chat: newChat, chat_messages: [] },
      });
    }

    // 4. 채팅방이 있는 경우, 조회
    if (chat_user) {
      console.log('채팅방이 있는 경우');

      const chat_id = chat_user.chat_id;

      // 4-1. 채팅방이 보내진 메세지 모두 읽음 표시
      await ChatMessages.update({ is_checked: true }, { where: { chat_id } });

      // 4-2. 이태까지 받은 메세지 20개씩 띄어서 받기
      const chat_messages = await ChatMessages.findAll({
        where: { chat_id },
        order: [['created_at', 'DESC']],
        limit: 20,
        offset: postPage * 20,
      });

      // // 테스트 (삭제 예정) ---------------->
      // await ChatMessages.create({
      //   chat_id: chat_user.chat_id,
      //   user_id: chat_user.user_id,
      //   message_type: 'message',
      //   message: '채팅방이 새로 생겨나서 메세지 보냅니다.',
      // });
      // console.log('기존 채팅방 참여');
      // console.log(
      //   '채팅방 ID: ',
      //   chat_user.chat_id,
      //   '상대방 ID: ',
      //   chat_user.user_id
      // );
      // <---------------------------------------

      return res.status(200).json({
        code: 200,
        message: '채팅 시작 성공',
        data: { user, chat: chat_user, chat_messages },
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 결제 요청 조회
const requestForPay = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Chat']
          #swagger.summary = '결제 요청'
          #swagger.description = '결제 요청' */

  /*  #swagger.responses[200] =  {  
              description: '결제 요청 성공',
              schema: {   "code" : 200, 
                          "message" : "결제 요청 성공",
                          "data": { $ref: '#/components/schemas/Chat/request_for_pay' }}}
  
      /*  #swagger.responses[400] = { 
              description: '결제 요청 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
  
      ========================================================================================================*/
  try {
    const user = res.locals.user;
    const user_id = user.id;
    const { carpool_id } = req.params;

    const chat = await ChatUsers.findOne({
      where: { [Op.not]: { user_id } },
    });

    const carpool_list = await Carpools.findAll({
      where: {
        [Op.and]: [{ status: 'request' }],
        user_id: { [Op.or]: [user_id, chat.user_id] },
      },
    });

    return res.status(200).json({
      code: 200,
      message: '결제 요청 성공',
      data: { user, carpool_list },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  getChat,
  startChat,
  requestForPay,
};
