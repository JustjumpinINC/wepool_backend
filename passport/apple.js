const jwt = require('jsonwebtoken');
const path = require('path');
const AppleAuth = require('apple-auth');
const appleConfig = require('../config/appleConfig');

const auth = new AppleAuth(appleConfig, appleConfig.private_key_path);
