const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const getUserInfos = require('../src/getUserInfos');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');
  console.log(authorization);

  if (!authToken || authType !== 'Bearer') {
    res.status(401).json({
      code: 401,
      message: '로그인 후 이용 가능한 기능입니다.!!',
    });
    return;
  }

  try {
    const { user_id } = jwt.verify(authToken, process.env.TOKEN);
    console.log('미들웨어 통과 중');

    // [오류] 탈퇴된 회원인 경우
    const userStatus = await getUserInfos.getHiddenUser(user_id);
    if (userStatus == 'hidden_by_user') {
      throw new Error('탈퇴 또는 정지된 회원입니다.');
    }

    // [오류] 권리자 권한으로 정지 또는 탈퇴된 회원인 경우
    if (userStatus == 'hidden_by_admin') {
      throw new Error('관리자 권한으로 탈퇴 또는 정지된 회원입니다. ');
    }

    await Users.findByPk(user_id).then((user) => {
      res.locals.user = {
        id: user.id,
        email: user.email,
        nick_name: user.nick_name,
        gender: user.gender,
        distance: user.distance,
        profile_image_url: user.profile_image_url,
        is_smoke: user.is_smoke,
        is_chat_push: user.is_chat_push,
        is_carpool_push: user.is_carpool_push,
        login_count: user.login_count,
      };

      console.log('미들웨어 통과 완료');
      next();
    });
  } catch (error) {
    const message = error.message
      ? error.message
      : '로그인 후 이용 가능한 기능입니다.';

    res.status(401).json({
      code: 401,
      message,
    });
    return;
  }
};
