const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/auth-middleware');

const {
  signup,
  login,
  isLogin,
  leave,
} = require('./controllers/userController');

const {
  getUserPage,
  banUser,
  blockUser,
} = require('./controllers/otherUserController');

// 회원 관리
// 회원가입
router.post('/signup', signup);

// 로그인
router.post('/login', login);

// 로그인 유효성 검사
router.get('/islogin', authMiddleware, isLogin);

// 회원 탈퇴 by 회원
router.post('/leave', authMiddleware, leave);

// 다른회원 관리
// 다른회원 조회
router.get('/:user_id', authMiddleware, getUserPage);

// 회원 경고
router.post('/ban/:ban_user_id', authMiddleware, banUser);

// 회원 차단
router.post('/block/:block_user_id', authMiddleware, blockUser);

module.exports = router;
