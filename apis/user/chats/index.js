const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/auth-middleware');

const {
  getChat,
  startChat,
  requestForPay,
} = require('./controllers/chatController');

// 채팅 목록 조회
router.get('/', authMiddleware, getChat);

// 채팅 시작
router.post('/:carpool_id', authMiddleware, startChat);

// 결제 요청
router.get('/pay/:chat_id', authMiddleware, requestForPay);

module.exports = router;
