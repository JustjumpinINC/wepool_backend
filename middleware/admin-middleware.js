const jwt = require('jsonwebtoken');
const { Users, Admins } = require('../models');
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
    console.log('미들웨어 시작');

    const admin = await getUserInfos.getAdminIdById(user_id);

    if (admin) {
      Users.findByPk(user_id).then((user) => {
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
    }

    if (!admin) {
      throw new Error('관리자가 아닙니다.');
    }
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: '로그인 후 이용 가능한 기능입니다.!_!',
    });
    return;
  }
};
