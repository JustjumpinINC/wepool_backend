const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../../middleware/admin-middleware');

const post = require('./controllers/postController');
const postBan = require('./controllers/postBanController');

// 게시물 관리------------------------------//
// 관리자 게시글 조회
router.get('/:category/all', adminMiddleware, post.getAllPostsByAdmin);

// 관리자 게시글 상세 조회
router.get('/:category/:post_id', adminMiddleware, post.getOnePostByAdmin);

// 관리자 게시글 숨김 / 복구
router.post('/hide/:category/:post_id', adminMiddleware, post.hidePostByAdmin);

// 게시물 신고 관리 ------------------------//
// 신고된 게시물 전체 조회
router.get('/ban/:status', adminMiddleware, postBan.getAllBanPost);

// 신고된 게시물 상세 조회
router.get('/ban/:post_id', adminMiddleware, postBan.getOneBanPost);

// 게시물 신고 거절
router.post('/ban/refuse/:post_id', adminMiddleware, postBan.refuseBanPost);

// 게시물 신고 처리 완료
router.post('/ban/close/:post_id', adminMiddleware, postBan.closeBanPost);

// 게시물 신고 내용 수정
router.patch('/ban/close/:post_id', adminMiddleware, postBan.editClosedBanPost);

module.exports = router;
