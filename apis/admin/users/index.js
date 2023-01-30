express = require('express');
const router = express.Router();
const adminMiddleware = require('../../../middleware/admin-middleware');

const admin = require('./controllers/adminController');
const userBan = require('./controllers/userBanController');

// 관리자 ------------------------------//
// 관리자 로그인
router.post('/login', admin.adminLogin);

// 관리자 로그인 유효성 검사
router.get('/islogin', adminMiddleware, admin.isLogin);

// 회원 전체 조회
router.get('/all/:type', admin.getAllUsers);

// 회원 상세 조회
router.get('/:user_id', admin.getOneUser);

// 회원 정지 / 피 신고자 정지
router.post('/suspend/:user_id', admin.suspendUserByAdmin);

// 회원 탈퇴 / 피 신고자 탈퇴
router.post('/delete/:user_id', admin.deleteUserByAdmin);

// 회원 신고 관리 ------------------------------//

// 채팅 조회
router.get('/chat/:ban_id', userBan.getChatByAdmin);

// 신고된 회원 전체 조회
router.get('/ban/all/:status', adminMiddleware, userBan.getAllBanUser);

// 신고된 회원 상세 조회
router.get('/ban/:ban_id', adminMiddleware, userBan.getOneBanUser);

// 회원 신고 거절
router.post('/ban/refuse/:user_id', adminMiddleware, userBan.refuseBanUser);

// 회원 신고 처리 완료
router.post('/ban/close/:user_id', adminMiddleware, userBan.closeBanUser);

// 회원 신고 내용 수정
router.patch('/ban/close/:user_id', adminMiddleware, userBan.editClosedBanUser);

module.exports = router;
