const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
});

const s3 = new AWS.S3();

// 업로드 파일 없는 경우 파일 생성
fs.readdir('uploads', (error) => {
  if (error) {
    console.error('uploads폴더가 없어 uploads폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME + '/uploads', // 생성한 버킷 이름
    key: (req, file, callback) => {
      // const uploadDirectory = req.query.directory ?? ''; // 업로드할 디렉토리 설정
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        // extension 확인을 위한 코드
        return callback(new Error('wrong extension'));
      }
      callback(null, `${Date.now()}_${file.originalname}`);
    },
    acl: 'public-read-write',
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
