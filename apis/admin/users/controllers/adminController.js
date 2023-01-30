const { Op } = require('sequelize');
const {
  Users,
  UserCars,
  UserCarExteriorImages,
  UserCarInteriorImages,
  Carpools,
  Communities,
  UserBanLogs,
  UserBlockLogs,
  CarpoolBanLogs,
  UserSuspendLogs,
  UserBlacklistLogs,
} = require('../../../../models');
const jwt = require('jsonwebtoken');
const getUserInfos = require('../../../../src/getUserInfos');
const generatePassword = require('../../../../src/generatePassword');
const dayjsTime = require('../../../../src/dayjsTime');
const now = dayjsTime.dayjsTime();

// TODO LIST ------------------->
// 1. 회원 전체조회
// - 인증 유무 추가 필요
//
// 2. 회원 상세조회
// - 인증 유무 조회 추가 필요
// - 누적 신고 내역 조회의 처리상태 추가 필요
// <-----------------------------

// 관리자 로그인
const adminLogin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '관리자 로그인'
          #swagger.description = '관리자 로그인'  */

  /*  #swagger.responses[200] =  {
              description: '관리자 로그인 성공',
              schema: {   "code" : 200,
                          "message" : "관리자 로그인 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '관리자 로그인 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { email, password } = req.body;

    // 1. 관리자 확인
    await getUserInfos.getAdminIdByEmail(email).then((admin) => {
      if (!admin) {
        throw new Error('관리자가 아닙니다.');
      }
    });

    // 2. 관리자 정보 조회
    const user = await getUserInfos.getUserInfoByEmail(email);
    const hashedPassword = await generatePassword.getHashedPassword(email); // 회원 암호화된 비밀번호 조회
    const is_user = await generatePassword.compareHashedPassword(
      // 회원 비밀번호 확인
      password,
      hashedPassword
    );

    // [오류] 이메일이 없는 경우
    if (!user) {
      throw new Error('아이디 혹은 비밀번호가 일치하지 않습니다.');
    }

    // [오류] 비밀번호가 틀린 경우
    if (is_user == false) {
      throw new Error('아이디 혹은 비밀번호가 일치하지 않습니다.ㅈ');
    }

    // 2. 토큰 생성
    const payload = { user_id: user.id };
    const secret = process.env.TOKEN;
    const options = {
      issuer: 'Wepool Service_BE',
      expiresIn: '20d',
    };
    const token = jwt.sign(payload, secret, options);

    return res.status(200).json({
      code: 200,
      message: '관리자 로그인 성공',
      data: { user },
      token,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 관리자 로그인 유효성 검사
const isLogin = async (req, res) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Admin: User']
        #swagger.summary = '관리자 로그인 유효성 검사'
        #swagger.description = '관리자 로그인 유효성 검사' */

  /*  #swagger.responses[200] =  {
            description: '관리자 로그인 유효성 검사 성공',
            schema: {   "code" : 200,
                        "message" : "관리자 로그인 유효성 검사 성공",
                        "data": { $ref: '#/components/schemas/User/user_info' }}}

    /*  #swagger.responses[401] = {
            description: '관리자 로그인 유효성 검사 실패',
            schema: { "code" : 401, "message" : "올바르지 않는 정보" }}
    ========================================================================================================*/

  try {
    const { user } = res.locals;
    const user_id = user.id;

    return res.status(200).json({
      code: 200,
      message: '관리자 로그인 유효성 검사 성공',
      data: { user },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 전체 조회
const getAllUsers = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
                  #swagger.summary = ' 회원 전체 조회'
                  #swagger.description = ' 회원 전체 조회'  */

  /*  #swagger.parameters['Driver'] = {  
                  in: 'query',
                  name: 'is_driver',
                  description: 'is_driver = true / false',
                  type: 'string'} 

      /*  #swagger.parameters['Certified'] = {  
                  in: 'query',
                  name: 'is_cert',
                  description: 'is_cert = true / false',
                  type: 'string'}                 
      
      /*  #swagger.parameters['Search'] = {  
                  in: 'query',
                  name: 'search',
                  description: 'search= name / email ',
                  type: 'string'} 

      /*  #swagger.parameters['Page'] = {  
                  in: 'query',
                  name: 'page',
                  description: '페이지: 없으면 = 0 (생략가능) / 있으면 1 ~ ... (20개씩 보여줌) ',
                  type: 'integer'} 

      /*  #swagger.responses[200] =  {
                  description: ' 회원 전체 조회 성공',
                  schema: {   "code" : 200,
                              "message" : " 회원 전체 조회 성공" }}
      
      /*  #swagger.responses[400] = {
              description: ' 회원 전체 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { type } = req.params;
    const { is_driver, is_cert, search, page } = req.query;
    const searchWord = !search ? '' : search;
    const postPage = !page ? 0 : page;

    // 1. 회원 리스트 생성
    let user_id_list = [];
    let driver_list = [];

    // 1-1. 드라이버 등록이 있는 회원 ID 조회
    const cars = await UserCars.findAll();
    console.log(is_driver == true, is_driver == 'true');

    if (is_driver == 'true') {
      console.log('true', '들어옴');
      cars.forEach((car) => {
        user_id_list.push(car.user_id);
      });
    }

    if (is_driver == 'false') {
      console.log('false', '들어왔니?');
      cars.forEach((car) => {
        driver_list.push(car.user_id);
      });
    }

    console.log(user_id_list, 'user_id_list');
    console.log(driver_list, 'non_driver_list');

    // 1-2. 인증 있는 회원 ID 조회 ------------------------> 인증 유무 추가 필요
    // if (is_cert) {
    //   await UserCars.findAll().then((certs) =>
    //     certs.forEach((cert) => {
    //       user_id_list.push(cert.user_id);
    //     })
    //   );
    // }

    // 회원 조회 기준
    const user_infos = await Users.findAll({
      where: {
        [Op.and]: [{ status: type }],
        id: {
          [Op.or]: user_id_list,
          [Op.notIn]: driver_list,
        },
        [Op.or]: [
          {
            nick_name: {
              [Op.like]: '%' + searchWord + '%',
            },
          },
          {
            email: {
              [Op.like]: '%' + searchWord + '%',
            },
          },
        ],
      },
      attributes: ['id', 'nick_name', 'email', 'created_at'],
      include: [
        {
          model: UserCars,
          as: 'user_cars',
          attributes: ['id'],
        },
        // -----------------------------------------> 인증 유무 추가 필요
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
      offset: postPage * 10,
    });

    const user_list = {
      user_infos,
    };

    return res.status(200).json({
      code: 200,
      message: ' 회원 전체 조회 성공',
      data: { user_list },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 상세 조회
const getOneUser = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 상세 조회'
          #swagger.description = '회원 상세 조회'  */

  /*  #swagger.responses[200] =  {
              description: '회원 상세 조회 성공',
              schema: {   "code" : 200,
                          "message" : "회원 상세 조회 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 상세 조회 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user_id } = req.params;

    // 1-1. 회원 기본정보 조회
    const user_info = await Users.findOne({
      where: { id: user_id },
      attributes: [
        'id',
        'provider',
        'email',
        'nick_name',
        'gender',
        'age_range',
        'created_at',
      ],
    });

    // 1-2. 회워 자동화 조회 / 자동차 유무 확인
    const car_info = await UserCars.findOne({
      where: { user_id },
      include: [
        {
          model: UserCarExteriorImages,
          as: 'user_car_exterior_images',
          attributes: { exclude: ['user_car_id', 'createdAt', 'updatedAt'] },
        },
        {
          model: UserCarInteriorImages,
          as: 'user_car_interior_images',
          attributes: { exclude: ['user_car_id', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    const has_car = !car_info ? false : true;

    // 1-3. 인증 유무 조회 -----------------------------> 작업 필요
    const certified_list = {
      status: '준비중입니다.',
      user_certified: true,
      crime_certified: true,
      driver_license: false,
      car_license: false,
      car_insurance: true,
    };

    const user = {
      user_info,
      has_car,
      certified_list,
    };

    // 2. 정지 정보 조회
    const suspend = await UserSuspendLogs.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: 1,
    });
    const is_suspended = dayjsTime.dayjsIsSuspended(suspend.end_date);
    const suspend_info = is_suspended ? suspend : null;

    // 3. 작성한 글 조회
    // 3-1. 카풀 작성한 글 조회
    const carpools = await Carpools.findAll({
      where: { user_id },
      attributes: ['id', 'title', 'image_url', 'type', 'created_at'],
    });
    const carpool_list = carpools.map((carpool) => {
      return carpool.id;
    });

    // 3-2. 낙서장 작성한 글 조회
    const communities = await Communities.findAll({
      where: { user_id },
      attributes: ['id', 'title', 'image_url', 'created_at'],
    });

    const post_list = {
      carpools,
      communities,
    };

    // 4. 누적 신고 내역 조회  --------------------> 처리 부분 작업필요
    // 회원 신고 건수 (보류)
    // const user_ban_list = await UserBanLogs.findAll({
    //   where: { ban_user_id: user_id },
    // });

    const carpool_ban_list = await CarpoolBanLogs.findAll({
      where: { ban_carpool_id: carpool_list },
    });

    return res.status(200).json({
      code: 200,
      message: '회원 상세 조회 성공',
      data: { user, suspend_info, car_info, post_list, carpool_ban_list },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 정지
const suspendUserByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 정지'
          #swagger.description = '회원 정지'  */

  /*  #swagger.responses[200] =  {
              description: '회원 정지 성공',
              schema: {   "code" : 200,
                          "message" : "회원 정지 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 정지 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user_id } = req.params;
    const { ban_type, ban_id, days, reason } = req.body;

    // [오류] 이미 정지 또는 탈퇴된 회원인 경우
    const userStatus = await getUserInfos.getHiddenUser(user_id);
    if (userStatus == 'hidden_by_user' || userStatus == 'hidden_by_admin') {
      throw new Error('이미 탈퇴 또는 정지된 회원입니다.');
    }

    // 1. 회원 상태 업데이트
    await Users.update(
      { is_hidden: true, hidden_by: 'admin' },
      { where: { id: user_id } }
    );

    // 2. 회원 정지 상태 생성
    const start_date = now;
    const end_date = dayjsTime.dayjsAddDays(start_date, days);
    await UserSuspendLogs.create({
      ban_type,
      ban_id,
      user_id,
      days,
      reason,
      start_date,
      end_date,
    });

    return res.status(200).json({ code: 200, message: '회원 정지 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

// 회원 탈퇴
const deleteUserByAdmin = async (req, res) => {
  /*========================================================================================================
      /* 	#swagger.tags = ['Admin: User']
          #swagger.summary = '회원 탈퇴'
          #swagger.description = '회원 탈퇴'  */

  /*  #swagger.responses[200] =  {
              description: '회원 탈퇴 성공',
              schema: {   "code" : 200,
                          "message" : "회원 탈퇴 성공" }}
  
      /*  #swagger.responses[400] = {
              description: '회원 탈퇴 실패',
              schema: { "code" : 400, "message" : "올바르지 않는 정보" }}
      ========================================================================================================*/

  try {
    const { user_id } = req.params;
    const { reason, is_blacklist } = req.body; // is_blacklist = true / false

    // [오류] 이미 정지 또는 탈퇴된 회원인 경우
    const userStatus = await getUserInfos.getHiddenUser(user_id);
    if (userStatus == 'hidden_by_user' || userStatus == 'hidden_by_admin') {
      throw new Error('이미 탈퇴 또는 정지된 회원입니다.');
    }

    // 1. 회원 상태 업데이트
    await Users.update(
      { is_hidden: true, hidden_by: 'admin' },
      { where: { id: user_id } }
    );

    // 2. 블랙리스트 회원인 경우
    if (is_blacklist == true) {
      await UserBlacklistLogs.create({
        user_id,
        reason,
      });
    }

    return res.status(200).json({ code: 200, message: '회원 탈퇴 성공' });
  } catch (error) {
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  adminLogin,
  isLogin,
  getAllUsers,
  getOneUser,
  suspendUserByAdmin,
  deleteUserByAdmin,
};
