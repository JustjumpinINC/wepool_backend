const { Users } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createHashedPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds); //솔트 생성
    const hash = await bcrypt.hash(plainPassword, salt); //해쉬 생성
    return hash;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getHashedPassword = async (email) => {
  try {
    const user = await Users.findOne({
      where: { email },
      attributes: ['password'],
    });

    return user.password;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const compareHashedPassword = async (plainPassword, hashedPassword) => {
  try {
    const compare = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(compare);
    return compare;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  createHashedPassword,
  getHashedPassword,
  compareHashedPassword,
};
