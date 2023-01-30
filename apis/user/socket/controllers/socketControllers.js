const { Op } = require('sequelize');
const { Users, Carpools, ChatMessages } = require('../../../../models');

// 확인된 메세지 보내기
// 상대방이 채팅방에 있는 경우
const sendCheckedMessage = async (data) => {
  const { chat_id, user_id, message } = data;

  await ChatMessages.create({
    chat_id,
    user_id,
    message_type: 'message',
    message,
    is_checked: true,
  });

  return;
};

// 확인이 필요한 메세지 보내기
// 상대방이 채팅방에 없는 경우
const sendUncheckedMessage = async (data) => {
  const { chat_id, user_id, message } = data;

  await ChatMessages.create({
    chat_id,
    user_id,
    message_type: 'message',
    message,
    is_checked: false,
  });

  return;
};

// 채팅방 접속
// 마지막 메세지가 본인인 경우
const updateMessages = async (chat_id) => {
  await ChatMessages.update({ is_checked: true }, { where: { chat_id } });

  return;
};

// 채팅방 접속
// 마지막 메세지가 상대방인 경우, 보내진 메세지 모두 읽음 표시

module.exports = {
  sendUncheckedMessage,
  sendCheckedMessage,
  updateMessages,
};
