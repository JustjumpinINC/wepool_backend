const express = require('express');
const router = express.Router();
const upload = require('../../../S3/imageUploader');

const { uploadImage, deleteImage } = require('./controllers/utilController');

// 이미지 업로드
router.post('/images', upload.array('image'), uploadImage);

// 이미지 삭제
router.delete('/image/:image_id', deleteImage);

module.exports = router;
