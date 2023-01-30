const express = require('express');
const router = express.Router();

const payment = require('./controllers/paymentController');

// 관리자 결제 조회
router.get('/all/:status', payment.getAllPaymentByAdmin);

// 관리자 결제 상세 조회
router.get('/:pay_id', payment.getOnePaymentByAdmin);

// 관리자 결제 강제 취소
router.post('/cancle/:pay_id', payment.refundPaymentByAdmin);

module.exports = router;
