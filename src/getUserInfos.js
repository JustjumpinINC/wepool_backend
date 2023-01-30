const { Users, Admins } = require('../models');

// 회원 조회 (이메일 기준)
const getUserInfoByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: { email },
      attributes: [
        'id',
        'email',
        'nick_name',
        'gender',
        'distance',
        'profile_image_url',
        'is_smoke',
        'is_chat_push',
        'is_carpool_push',
        'is_community_push',
        'login_count',
      ],
    });

    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 회원 조회 (회원ID 기준)
const getUserInfoById = async (user_id) => {
  try {
    const user = await Users.findOne({
      where: { user_id },
      attributes: [
        'id',
        'email',
        'nick_name',
        'gender',
        'distance',
        'profile_image_url',
        'is_smoke',
        'is_chat_push',
        'is_carpool_push',
        'is_community_push',
        'login_count',
      ],
    });
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 관리자 조회 (회원ID 기준)
const getAdminIdByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: { email },
      attributes: ['id'],
    });

    const admin = await Admins.findOne({
      where: { user_id: user.id },
      attributes: ['id'],
    });

    const is_admin = !admin ? false : true;

    return is_admin;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 관리자 조회 (회원ID 기준)
const getAdminIdById = async (user_id) => {
  try {
    const admin = await Admins.findOne({
      where: { user_id },
      attributes: ['id'],
    });
    const is_admin = !admin ? false : true;
    return is_admin;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// 정지/ 탈퇴된 회원 조회
const getHiddenUser = async (user_id) => {
  try {
    let result;
    const user = await Users.findOne({
      where: { id: user_id },
      attributes: ['id', 'is_hidden', 'hidden_by'],
    });

    const status = user.is_hidden == true ? true : false;

    if (status == true) {
      result = user.hidden_by == 'user' ? 'hidden_by_user' : 'hidden_by_admin';
    }
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getUserInfoByEmail,
  getUserInfoById,
  getAdminIdByEmail,
  getAdminIdById,
  getHiddenUser,
};
