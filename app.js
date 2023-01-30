require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
// const logger = require('./logger');
const routers = require('./apis/user');
const adminRouters = require('./apis/admin');
// const kakaoPassport = require('./passport');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output');
const { sequelize } = require('./models/index');
const SocketIO = require('./apis/user/socket');
const port = process.env.PORT || 3001;
const httpPort = 3000;
const httpsPort = 443;
const app = express();
const app_http = express();
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');

const { dayjsTime } = require('./src/dayjsTime'); // 시간 설정
const now = dayjsTime();

app.set('port', port);

// 미들웨어 (가장 상위에 위치)
const requestMiddleware = (req, res, next) => {
  console.log(
    now,
    `  [ip] ${req.ip}  [${req.method}]  ${req.rawHeaders[1]}   ${req.originalUrl}`
  );
  next();
};

// 서버 실행시 MYSQL과 연결
sequelize
  .sync({ force: false }) // 서버 실행시마다 테이블을 재생성할건지에 대한 여부, {alter: true}은 수정
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

// kakaoPassport(app); // 카카오 소셜로그인 연결

// CORS
const corsOption = {
  origin: [
    'http://localhost:3000',
    '*',
    // 'https://wepool.co.kr',
    // 'https://www.wepool.co.kr',
  ],
  credentials: true,
};

app.use(cors(corsOption));
app.use(helmet());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static'))); // socket_view 파일연결
app.use(requestMiddleware);
app.use('/', routers);
app.use('/admin', adminRouters);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // swagger 설정

// [오류] 404_없는 페이지 요청하는 경우
app.use((req, res, next) => {
  // logger.error('존재하지 않는 url주소 입니다.');
  res.status(404).json({
    code: 404,
    message: '올바르지 않는 정보: 존재하지 않는 url주소 입니다.',
  });
});

// [오류] 500_서버 에러의 경우
app.use((error, req, res, next) => {
  // logger.error(error);
  res.status(500).json({
    code: 500,
    message: '올바르지 않는 정보: 서버에 에러가 발생하였습니다.',
  });
});

const httpServer = http.createServer(app);
SocketIO(httpServer);

httpServer.listen(httpPort, () => {
  console.log(`${httpPort}`, 'http서버가 켜졌어요!');
});
