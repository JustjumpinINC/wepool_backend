const { Random_names_back, Random_names_front, Users } = require('../models');
const { Op } = require('sequelize');

// 닉네임: 닉네임 중복시 랜덤글자 추가
const generateRandomString = (num) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  console.log(result);
  return result;
};

// 닉네임: 랜덤 형용사 조회
const generateRandomFront = async () => {
  try {
    // 1. 랜덤 숫자 생성
    // random_names_front 테이블 콜롬 갯수 : 132
    const ramdomNumber = Math.floor(Math.random() * 132) + 1;

    // 2. 랜덤 이름 조회
    const ramdoms = await Random_names_front.findOne({
      where: { id: ramdomNumber },
    });

    return ramdoms.name;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 닉네임: 랜덤 사물 조회
const generateRandomBack = async () => {
  try {
    // 1. 랜덤 숫자 생성
    // random_names_front 테이블 콜롬 갯수 : 110
    const ramdomNumber = Math.floor(Math.random() * 110) + 1;

    // 2. 랜덤 이름 조회
    const ramdoms = await Random_names_back.findOne({
      where: { id: ramdomNumber },
    });

    return ramdoms.name;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 닉네임: 최종 닉네임
const createNickname = async () => {
  try {
    const front_name = await generateRandomFront();
    const back_name = await generateRandomBack();

    let nick_name = front_name + ' ' + back_name;

    const sameNamedUser = await Users.findAll({
      where: {
        nick_name: {
          [Op.like]: nick_name + '%',
        },
      },
    });

    // 닉네임 중복시, 닉네임 + 랜덤글자(4)
    if (sameNamedUser.length > 0) {
      let randomString = generateRandomString(4);
      nick_name = nick_name + randomString;
    }

    return nick_name;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  generateRandomString,
  generateRandomFront,
  generateRandomBack,
  createNickname,
};
