const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../../middleware/admin-middleware');

const manage = require('./controllers/manageController');

// 짤 조회
router.get('/image', adminMiddleware, manage.getImagesList);

// 카테고리 생성
router.post('/category', adminMiddleware, manage.createCategory);

// 카테고리 수정
router.patch('/category', adminMiddleware, manage.editCategory);

// 카테고리 삭제
router.delete('/category', adminMiddleware, manage.deleteCategory);

// 푸쉬알림 조회
router.get('/push', adminMiddleware, manage.getPushList);

// 푸쉬알림 생성(전송)
router.post('/push', adminMiddleware, manage.createPushList);

// 공지사항 생성
router.post('/notice', adminMiddleware, manage.createNotice);

// 공지사항 조회
router.get('/notice', adminMiddleware, manage.getAllNotics);

// 공지사항 상세조회
router.get('/notice/:notice_id', adminMiddleware, manage.getOneNotice);

// 공지사항 수정
router.patch('/notice/:notice_id', adminMiddleware, manage.editNotice);

// 공지사항 삭제
router.delete('/notice/:notice_id', adminMiddleware, manage.deleteNotice);

module.exports = router;
