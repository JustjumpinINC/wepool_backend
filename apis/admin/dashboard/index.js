const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../../middleware/admin-middleware');

const dashboard = require('./controllers/dashboardController');

// 관리자 대시보드 조회
router.get('/', adminMiddleware, dashboard.getAllInfo);

module.exports = router;
