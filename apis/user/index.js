const express = require('express');
const userRouter = require('./users');
const socialRouter = require('./social');
const postRouter = require('./posts');
const mypageRouter = require('./mypages');
const utilRouter = require('./utils');
const chatRouter = require('./chats');

const router = express.Router();

router.use('/user', userRouter);
router.use('/user', socialRouter);
router.use('/post', postRouter);
router.use('/mypage', mypageRouter);
router.use('/util', utilRouter);
router.use('/chat', chatRouter);

module.exports = router;
