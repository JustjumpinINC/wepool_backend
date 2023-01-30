const express = require('express');
const userRouter = require('./users');
const dashboardRouter = require('./dashboard');
const postRouter = require('./posts');
const paymentRouter = require('./payments');
const manageRouter = require('./manage');

const router = express.Router();

router.use('/user', userRouter);
router.use('/dashboard', dashboardRouter);
router.use('/post', postRouter);
router.use('/payment', paymentRouter);
router.use('/manage', manageRouter);

module.exports = router;
