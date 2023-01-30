const { Op } = require('sequelize');
const {
  Users,
  UserLocations,
  UserBanLogs,
  Carpools,
  CarpoolLikes,
  Communities,
  CommunityLikes,
  ChatMessages,
  ChatUsers,
} = require('../../../../models');

const jwt = require('jsonwebtoken');
const generateRandomName = require('../../../../src/generateRandomName');
const generatePassword = require('../../../../src/generatePassword');
const getUserInfos = require('../../../../src/getUserInfos');
const { dayjsTime } = require('../../../../src/dayjsTime');
const now = dayjsTime();

// 회원가입
const signup = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '회원가입'
        #swagger.description = '회원가입' */

  /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/User/singup'  }
        }

    /*  #swagger.responses[201] =  {
            description: '회원가입 성공',
            schema: {   "code" : 201, "message" : "회원가입 성공" }}

    /*  #swagger.responses[400] = {
            description: '회원가입 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const {
      email,
      password,
      gender,
      is_smoke,
      address,
      address_detail,
      latitude,
      longitude,
    } = req.body;

    // 회원 조회
    const user = await Users.findOne({
      where: { email },
      attributes: ['id'],
    });

    // 1. 일반 회원인 경우
    if (!user) {
      const hashedPassword = await generatePassword.createHashedPassword(
        password
      ); // 비밀번호 암호화
      const nick_name = await generateRandomName.createNickname(); // 닉네임 생성

      console.log('일반 로그인인 경우');
      await Users.create({
        provider: 'WEPOOL',
        provider_uid: 0,
        email,
        password: hashedPassword,
        nick_name,
        gender,
        is_smoke,
        last_login_at: now,
        login_count: 0,
      }).catch((error) => {
        // [오류] 시퀄라이즈 오류
        if (error.name == 'SequelizeValidationError') {
          return res.status(400).json({
            code: 400,
            message: '올바르지 않는 정보: ' + error.errors[0].message,
          });
        }
      });
    }

    // 2. 소셜 회원인 경우
    if (user) {
      const user_id = user.id;
      console.log('소셜 로그인인 경우');

      // [오류] 탈퇴된 회원인 경우
      const userStatus = await getUserInfos.getHiddenUser(user_id);
      if (userStatus == 'hidden_by_user') {
        throw new Error('탈퇴 또는 정지된 회원입니다.');
      }

      // [오류] 권리자 권한으로 정지 또는 탈퇴된 회원인 경우
      if (userStatus == 'hidden_by_admin') {
        throw new Error('관리자 권한으로 탈퇴 또는 정지된 회원입니다. ');
      }

      // [오류] 회원가입이 완료된 회원인 경우
      await UserLocations.findAll({ where: { user_id } }).then((locations) => {
        console.log(locations.length);
        if (locations.length >= 1) {
          throw new Error('이미 회원가입이 완료되었습니다.');
        }
      });

      await Users.update(
        {
          gender,
          is_smoke,
        },
        { where: { id: user_id } }
      ).catch((error) => {
        // [오류] 시퀄라이즈 오류
        if (error.name == 'SequelizeValidationError') {
          return res.status(400).json({
            code: 400,
            message: '올바르지 않는 정보: ' + error.errors[0].message,
          });
        }
      });
    }

    // 3. 주소 저장
    await Users.findOne({ where: { email } })
      .then((user) => {
        console.log(user);
        UserLocations.create({
          user_id: user.id,
          address,
          address_detail,
          latitude,
          longitude,
          start_selected: true,
        });
      })
      .then(() => {
        return res.status(201).json({ code: 201, message: '회원가입 성공' });
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 일반 로그인
const login = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '로그인'
        #swagger.description = '로그인' */

  /*	#swagger.parameters['payload'] = {
            in: 'body',
            description: 'Request Body',
            required: true,
            schema: {   $ref: '#/components/schemas/User/login'  }}

    /*  #swagger.responses[200] =  {
            description: '로그인 성공',
            schema: {   "code" : 200,
                        "message" : "로그인 성공",
                        "data": { $ref: '#/components/schemas/User/user_info' },
                        "token" : "token"}}

    /*  #swagger.responses[400] = {
            description: '로그인 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const { email, password } = req.body;

    // 1. 회원 정보 조회
    const user = await getUserInfos.getUserInfoByEmail(email);
    const hashedPassword = await generatePassword.getHashedPassword(email); // 회원 암호화된 비밀번호 조회
    const is_user = await generatePassword.compareHashedPassword(
      // 회원 비밀번호 확인
      password,
      hashedPassword
    );
    const user_id = user.id;

    // [오류] 탈퇴된 회원인 경우
    const userStatus = await getUserInfos.getHiddenUser(user_id);
    if (userStatus == 'hidden_by_user') {
      throw new Error('탈퇴 또는 정지된 회원입니다.');
    }

    // [오류] 권리자 권한으로 정지 또는 탈퇴된 회원인 경우
    if (userStatus == 'hidden_by_admin') {
      throw new Error('관리자 권한으로 탈퇴 또는 정지된 회원입니다. ');
    }

    // [오류] 이메일이 없는 경우
    if (!user) {
      throw new Error('아이디 혹은 비밀번호가 일치하지 않습니다.');
    }

    // [오류] 비밀번호가 틀린 경우
    if (is_user == false) {
      throw new Error('아이디 혹은 비밀번호가 일치하지 않습니다.');
    }

    // 1-1. 로그인 횟수, 로그인 날짜 업데이트
    await Users.update(
      { is_login: true, last_login_at: now, login_count: user.login_count + 1 },
      { where: { id: user.id } }
    );

    // 2. 알람 조회
    const alarms = {
      carpool_likes_alarm: 0,
      community_likes_alarm: 0,
      chat_alarm: 0,
    };

    console.log(user);

    // 2-1. 회원 카풀 찜 알림 조회
    const carpool_likes = await CarpoolLikes.findAll({
      where: {
        [Op.and]: [{ is_checked: false }],
      },
      include: [
        {
          model: Carpools,
          as: 'carpools',
          where: { user_id, is_hidden: false },
        },
      ],
    });

    alarms.carpool_likes_alarm =
      user.is_carpool_push == true ? carpool_likes.length : 0;

    // 2-2. 내 회원 게시물 찜 알림 조회
    const community_likes = await CommunityLikes.findAll({
      where: {
        [Op.and]: [{ is_checked: false }],
      },
      include: [
        {
          model: Communities,
          as: 'communities',
          where: { user_id, is_hidden: false },
        },
      ],
    });

    alarms.community_likes_alarm =
      user.is_community_push == true ? community_likes.length : 0;

    // 2-3. 채팅 알림 조회
    // 2-3-1. 회원과 연관된 채팅방 조회
    const chat_list = [];
    await ChatUsers.findAll({
      where: { user_id },
      attributes: ['chat_id'],
    }).then((chats) => {
      for (chat of chats) {
        chat_list.push(chat.chat_id);
      }
    });

    // 2-3-2. 회원이 경고한 회원 조회
    const ban_user_list = [];
    await UserBanLogs.findAll({
      where: { user_id },
      attributes: ['ban_user_id'],
    }).then((bans) => {
      for (ban of bans) {
        ban_user_list.push(ban.ban_user_id);
      }
    });

    // 2-3-3. 회원이 경고한 채팅방 조회
    const ban_chat_list = [];
    await ChatUsers.findAll({
      where: {
        [Op.or]: { user_id: ban_user_list },
      },
    }).then((bans) => {
      for (ban of bans) {
        ban_chat_list.push(ban.chat_id);
      }
    });

    // 2-3-4. 회원이 경고한 채팅방이 제외된 채팅방 조회
    let new_chat_list = chat_list.filter(
      (chat_id) => !ban_chat_list.includes(chat_id)
    );

    // 2-3-5. 회원과 연관된 채팅방 조회
    const chats = await ChatMessages.findAll({
      where: {
        [Op.and]: [{ is_checked: false }, { chat_id: new_chat_list }],
      },
    });

    alarms.chat_alarm = user.is_chat_push == true ? chats.length : 0;

    // 3. 토큰 생성
    const payload = { user_id: user.id };
    const secret = process.env.TOKEN;
    const options = {
      issuer: 'Wepool Service_BE',
      expiresIn: '20d',
    };
    const token = jwt.sign(payload, secret, options);

    res.status(200).json({
      code: 200,
      message: '로그인 성공',
      data: { user, alarms },
      token,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 로그인 유효성 검사
const isLogin = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '로그인 유효성 검사'
        #swagger.description = '로그인 유효성 검사' */

  /*  #swagger.responses[200] =  {
            description: '로그인 유효성 검사 성공',
            schema: {   "code" : 200,
                        "message" : "로그인 유효성 검사 성공",
                        "data": { $ref: '#/components/schemas/User/user_info' }}}

    /*  #swagger.responses[401] = {
            description: '로그인 유효성 검사  실패',
            schema: { "code" : 401, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    // 알람 조회
    const alarms = {
      carpool_likes_alarm: 0,
      community_likes_alarm: 0,
      chat_alarm: 0,
    };

    console.log(user);

    // 1. 회원 카풀 찜 알림 조회
    const carpool_likes = await CarpoolLikes.findAll({
      where: {
        [Op.and]: [{ is_checked: false }],
      },
      include: [
        {
          model: Carpools,
          as: 'carpools',
          where: { user_id, is_hidden: false },
        },
      ],
    });

    alarms.carpool_likes_alarm =
      user.is_carpool_push == true ? carpool_likes.length : 0;

    // 2. 내 회원 게시물 찜 알림 조회
    const community_likes = await CommunityLikes.findAll({
      where: {
        [Op.and]: [{ is_checked: false }],
      },
      include: [
        {
          model: Communities,
          as: 'communities',
          where: { user_id, is_hidden: false },
        },
      ],
    });

    alarms.community_likes_alarm =
      user.is_community_push == true ? community_likes.length : 0;

    // 3. 채팅 알림 조회
    // 3-1. 회원과 연관된 채팅방 조회
    const chat_list = [];
    await ChatUsers.findAll({
      where: { user_id },
      attributes: ['chat_id'],
    }).then((chats) => {
      for (chat of chats) {
        chat_list.push(chat.chat_id);
      }
    });

    // 3-2. 회원이 경고한 회원 조회
    const ban_user_list = [];
    await UserBanLogs.findAll({
      where: { user_id },
      attributes: ['ban_user_id'],
    }).then((bans) => {
      for (ban of bans) {
        ban_user_list.push(ban.ban_user_id);
      }
    });

    // 3-3. 회원이 경고한 채팅방 조회
    const ban_chat_list = [];
    await ChatUsers.findAll({
      where: {
        [Op.or]: { user_id: ban_user_list },
      },
    }).then((bans) => {
      for (ban of bans) {
        ban_chat_list.push(ban.chat_id);
      }
    });

    // 3-4. 회원이 경고한 채팅방이 제외된 채팅방 조회
    let new_chat_list = chat_list.filter(
      (chat_id) => !ban_chat_list.includes(chat_id)
    );

    // 3-5. 회원과 연관된 채팅방 조회
    const chats = await ChatMessages.findAll({
      where: {
        [Op.and]: [{ is_checked: false }, { chat_id: new_chat_list }],
      },
    });

    alarms.chat_alarm = user.is_chat_push == true ? chats.length : 0;

    return res.status(200).json({
      code: 200,
      message: '로그인 유효성 검사 성공',
      data: { user, alarms },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 탈퇴 by 회원
const leave = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['User']
        #swagger.summary = '회원 탈퇴'
        #swagger.description = '회원 탈퇴' */

  /*  #swagger.responses[200] =  {
            description: '회원 탈퇴 성공',
            schema: {   "code" : 200, "message" : "회원 탈퇴 성공" }}

    /*  #swagger.responses[400] = {
            description: '회원 탈퇴 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    const { user } = res.locals;
    const user_id = user.id;

    // 회원 상태 확인
    await Users.findOne({
      where: { id: user_id },
      attributes: ['is_hidden', 'hidden_by'],
    }).then((user) => {
      console.log(user);
      if (user.is_hidden == true && user.hidden_by == 'user') {
        throw new Error('이미 탈퇴된 회원입니다.');
      }

      if (user.is_hidden == true && user.hidden_by == 'admin') {
        throw new Error('관리자 권한으로 탈퇴된 회원입니다.');
      }
    });

    // 회원 상태 변경
    await Users.update(
      { is_hidden: true, hidden_by: 'user' },
      { where: { id: user_id } }
    ).catch((error) => {
      // [오류] 시퀄라이즈 오류
      if (error.name == 'SequelizeValidationError') {
        return res.status(400).json({
          code: 400,
          message: '올바르지 않는 정보: ' + error.errors[0].message,
        });
      }
    });

    return res.status(201).json({ code: 201, message: '회원 탈퇴 성공' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  signup,
  login,
  isLogin,
  leave,
};
