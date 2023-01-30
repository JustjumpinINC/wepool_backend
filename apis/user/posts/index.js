const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/auth-middleware');

const {
  getAllPost,
  getOnePost,
  createPost,
  editPost,
  matchPost,
  banPost,
  likePost,
  deletePost,
} = require('./controllers/postController');

// 모든 게시물 조회
router.get('/:category', authMiddleware, getAllPost);

// 특정 게시물 조회
router.get('/:category/:post_id', authMiddleware, getOnePost);

// 게시글 작성
router.post('/:category', authMiddleware, createPost);

// 게시글 수정
router.patch('/:category/:post_id', authMiddleware, editPost);

// 게시글 매칭
router.post('/match/:carpool_id', authMiddleware, matchPost);

// 게시글 신고
router.post('/ban/:category/:post_id', authMiddleware, banPost);

// 게시글 찜하기
router.post('/like/:category/:post_id', authMiddleware, likePost);

// 게시글 삭제
router.delete('/:category/:post_id', authMiddleware, deletePost);

module.exports = router;
