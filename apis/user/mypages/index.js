const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/auth-middleware');
// const upload = require('../S3/s3');

const {
  getMypage,
  editProfile,
  getMyPost,
  getMyHistory,
  cancelCarpool,
  getMyLike,
} = require('./controllers/mypageMainController');

const {
  getTotalWageList,
  setWageAccount,
} = require('./controllers/mypageWageController');

const {
  createReview,
  getMyReview,
  getMyPayment,
  cancelMyPayment,
  setCarInfo,
  getCarInfo,
  getMyAuth,
  editMyAuth,
  registerAddress,
  getAddress,
  deleteAddress,
  selectAddress,
} = require('./controllers/mypageInfoController');

const {
  getLikeAlarm,
  editAlarm,
  getNotice,
  getOneNotice,
  createNotice,
  editNotice,
  getContactUs,
  editContactUs,
  getService,
  getOneService,
} = require('./controllers/mypageSettingController');

// 마이페이지_메인

// 마이페이지 조회_본인
router.get('/', authMiddleware, getMypage);

// 프로필 수정
// router.patch('/profile', authMiddleware, upload.single('userImage'), editProfile);
router.patch('/profile', authMiddleware, editProfile);

// 작성 글 조회
router.get('/mypost/:category', authMiddleware, getMyPost);

// 이용 내역 조회
router.get('/history', authMiddleware, getMyHistory);

// 이용 내역 > 카풀 취소 요청
router.post('/cancel/:carpool_user_id', authMiddleware, cancelCarpool);

// 찜 조회
router.get('/like/:category', authMiddleware, getMyLike);

// 마이페이지_정산

// 정산 내역 조회
router.get('/trade', authMiddleware, getTotalWageList);

// 정산 계좌 등록
router.post('/trade/account', authMiddleware, setWageAccount);

// 마이페이지_내정보

// 리뷰 작성
router.post('/review/:carpool_id', authMiddleware, createReview);

// 리뷰 조회
router.get('/review/', authMiddleware, getMyReview);

// 결제 조회
router.get('/payment/:match_id', authMiddleware, getMyPayment);

// 결제 취소
router.post('/payment/:match_id/:status', authMiddleware, cancelMyPayment);

// 내 차 정보 등록
router.post('/car', authMiddleware, setCarInfo);

// 내 차 정보 조회
router.get('/car', authMiddleware, getCarInfo);

// 인증 조회
router.post('/auth/:type', authMiddleware, getMyAuth);

// 인증 수정
router.patch('/auth/:type', authMiddleware, editMyAuth);

// 주소 등록
router.post('/address', authMiddleware, registerAddress);

// 주소 조회
router.get('/address', authMiddleware, getAddress);

// 주소 삭제
router.delete('/address/:address_id', authMiddleware, deleteAddress);

// 주소 선택
router.patch('/address/:type/:address_id', authMiddleware, selectAddress);

// 마이페이지_설정

// 알림 조회
router.get('/alarm', authMiddleware, getLikeAlarm);

// 알림 설정 수정
router.patch('/alarm/:type', authMiddleware, editAlarm);

// 공지사항 조회
router.get('/notice', getNotice);

// 공지사항 조회_자세히
router.get('/notice/:notice_id', getOneNotice);

// 공지사항 작성
router.post('/notice', authMiddleware, createNotice);

// 공지사항 수정
router.patch('/notice/:notice_id', authMiddleware, editNotice);

// 문의하기 조회
router.get('/contact', authMiddleware, getContactUs);

// 문의하기 수정
router.patch('/contact', authMiddleware, editContactUs);

// 서비스 약관 조회
router.get('/service', authMiddleware, getService);

// 서비스 약관 조회_자세히
router.get('/service/:service_id', authMiddleware, getOneService);

module.exports = router;
