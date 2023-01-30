const express = require('express');
const router = express.Router();
const passport = require('passport');

const { kakaoCallback } = require('./controllers/socialContoller');

// 소셜 로그인
// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', kakaoCallback);

// 애플로그인

module.exports = router;
