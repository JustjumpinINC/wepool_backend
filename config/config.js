require('dotenv').config();

const development = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  host: process.env.DEV_DB_HOST,
  dialect: 'mysql',
  timezone: '+09:00',
  logging: false, // sql query 터미널에서 확인하기 (개발시: true/ 배포시: false)
};

const test = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  host: process.env.DEV_DB_HOST,
  dialect: 'mysql',
};

const production = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  host: process.env.DEV_DB_HOST,
  dialect: 'mysql',
};

module.exports = { development, production, test };
