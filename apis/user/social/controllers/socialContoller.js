const passport = require('passport');
const jwt = require('jsonwebtoken');
const { dayjsTime } = require('../../../../src/dayjsTime');
const { Users, UserLocations } = require('../../../../models');

// 카카오 로그인
const kakaoCallback = (req, res, next) => {
  /*========================================================================================================
    /* 	#swagger.tags = ['Social']
        #swagger.summary = '카카오 로그인'
        #swagger.description = '카카오 로그인' */

  /*  #swagger.responses[200] =  {
            description: '카카오 로그인 성공',
            schema: {   "code" : 200,
                        "message" : "카카오 로그인 성공",
                        "data": { $ref: '#/components/schemas/User/user_info' },
                        "token" : "token"}}

    /*  #swagger.responses[400] = {
            description: '카카오 로그인 실패',
            schema: { "code" : 400, "message" : "올바르지 않는 정보" }}

    ========================================================================================================*/
  try {
    passport.authenticate(
      'kakao',
      {
        failureRedirect: '/',
      },
      async (err, user) => {
        const now = await dayjsTime();

        console.log(user, 'social_Controller');

        if (err) return next(err);
        const user_id = user.id;

        // 1. 회원 주소 조회
        const existLocations = await UserLocations.findAll({
          where: { user_id },
        });

        // 2. 토큰 생성
        const payload = { user_id };
        const secret = process.env.TOKEN;
        const options = {
          issuer: 'Wepool Service_BE',
          expiresIn: '1d',
        };
        const token = jwt.sign(payload, secret, options);

        // 3. 회원이 아닌경우
        if (existLocations.length == 0) {
          return res.status(400).json({
            code: 400,
            message: '올바르지 않는 정보: 회원가입 필요',
          });
        }

        // 4. 회원인 경우
        // 4-1. 회원 로그인
        await Users.update(
          {
            is_login: true,
            last_login_at: now,
            login_count: user.login_count + 1,
          },
          { where: { id: user_id } }
        );

        return res.status(200).json({
          code: 200,
          message: '카카오 로그인 성공',
          data: { user },
          token,
        });
      }
    )(req, res, next);
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ code: 400, message: '올바르지 않는 정보: ' + error.message });
  }
};

module.exports = {
  kakaoCallback,
};
