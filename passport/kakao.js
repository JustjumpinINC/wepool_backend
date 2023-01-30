const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { Users } = require('../models');
const { dayjsTime } = require('../src/dayjsTime');
const generateRandomName = require('../src/generateRandomName');

// createNickname,
//   generateRandomString,
module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: process.env.KAKAO_CALL_BACK_URL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(accessToken, refreshToken, '토큰 확인');
          console.log('프로필 확인 : ', profile);
          const now = dayjsTime();
          const provider = profile.provider.toUpperCase();
          const provider_uid = profile.id;
          const profile_image_url = 'image_url';
          const email = profile._json.kakao_account.email;
          const password = generateRandomName.generateRandomString(20);

          // 카카오에서 성별/나이 조회
          const gender = !profile._json.kakao_account.gender
            ? 'MALE'
            : profile._json.kakao_account.gender;
          const age_range = !profile._json.kakao_account.age_range
            ? 0
            : parseInt(profile._json.kakao_account.age_range.split('~')[0]);

          // 1. 기존 회원 조회
          const existUser = await Users.findOne({
            where: { provider, provider_uid, email },
          });

          // 2. 회원이 없는 경우 => 생성
          if (!existUser) {
            const nick_name = await generateRandomName.createNickname();
            console.log('회원이 없는 경우', nick_name);
            const guest = await Users.create({
              provider,
              provider_uid,
              profile_image_url,
              email,
              password,
              nick_name,
              gender,
              age_range,
              is_smoke: false,
              last_login_at: now,
              login_count: 0,
            });
            return done(null, guest);
          }

          console.log('회원이 있는 경우');
          // 3. 회원이 있는 경우
          const user = {
            id: existUser.id,
            email: existUser.email,
            nick_name: existUser.nick_name,
            gender: existUser.gender,
            age_range: existUser.age_range,
            distance: existUser.distance,
            profile_image_url: existUser.profile_image_url,
            is_smoke: existUser.is_smoke,
            is_chat_push: existUser.is_chat_push,
            is_carpool_push: existUser.is_carpool_push,
            is_community_push: existUser.is_community_push,
            login_count: existUser.login_count,
          };

          return done(null, user);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
