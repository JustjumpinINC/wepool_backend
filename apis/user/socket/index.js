require('dotenv').config();
const { Op } = require('sequelize');
const { Server } = require('socket.io');
const {
  sendUncheckedMessage,
  sendCheckedMessage,
  updateMessages,
} = require('./controllers/socketControllers');
const { Users, Carpools, ChatMessages } = require('../../../models');

const { dayjsChatTime } = require('../../../src/dayjsTime'); // 시간 설정
const chatNow = dayjsChatTime();

module.exports = (server) => {
  // 소켓
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://bella-test.shop/',
        'http://www.bella-test.shop/',
        //   'https://www.domain.com',
        //   'https://domain.com',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
      pingInterval: 10000,
      pingTimeout: 5000,
    },
  });

  // 연결 시작
  io.on('connection', (socket) => {
    console.log('소켓 연결 성공!');
    console.log(chatNow);

    // [2] 방 입장하기
    socket.on('join', async (data) => {
      console.log(data, '방 입장하기');
      const { chat_id, user_id } = data;
      const socket_id = socket.id;
      const user = await Users.findByPk(user_id);

      // 마지막 메세지가 본인/상대방인지 확인
      const lastMessage = await ChatMessages.findAll({
        where: { chat_id },
        attributes: ['user_id', 'message'],
        order: [['created_at', 'DESC']],
        limit: 1,
      });

      console.log(lastMessage[0].user_id, user_id);

      // 마지막 메세지가 상대방인 경우, 보내진 메세지 모두 읽음 표시
      if (lastMessage[0].user_id != user_id) {
        updateMessages(chat_id);
      }

      console.log('방 입장한 유저 :', user.id, 'socket_id: ', socket_id);

      socket.join(chat_id, user_id);

      // console.log(
      //   '방 안에 들어와 있는 socket_id:',
      //   socket.adapter.rooms,
      //   socket.adapter.sids, // 채팅방 접속 확인
      //   socket.adapter.rooms.get(chat_id)?.size // 방에 접속한 사람 수
      // );

      // [3] 방 입장하기
      io.to(chat_id).emit('join', {
        user_id: user.id,
        nick_name: user.nick_name,
      });
    });

    // [2] 메세지 보내기
    socket.on('chatting', async (data) => {
      console.log(data, '메세지 보내기');
      const { message, chat_id, user_id } = data;
      const userCount = socket.adapter.rooms.get(chat_id)?.size; // 방에 접속한 사람 수

      const user = await Users.findByPk(user_id);
      const { nick_name, profile_image_url } = user;
      const params = {
        user_id: user.id,
        profile_image_url,
        nick_name,
        message,
        time: chatNow,
      };

      // [3] 메세지가 잘~ 들어온 경우
      // 빈칸인 경우, 오류를 줄 수가 없어서 프론트에 요청
      // [3-1] 빈칸이 아닌 경우 + 회원이 채팅방에 혼자인 경우
      if (message != 0 && userCount == 1) {
        sendUncheckedMessage(data); // 메세지 생성
        io.to(chat_id).emit('chatting', params);
      }

      // [3-2]빈칸이 아닌 경우 + 회원이 채팅방에 2명인 경우
      if (message != 0 && userCount == 2) {
        sendCheckedMessage(data); // 메세지 생성
        io.to(chat_id).emit('chatting', params);
      }

      // [3-3] 메세지 저장
      await ChatMessages.create({
        chat_id,
        user_id,
        message,
        message_type: 'message',
      });
    });

    // [2] 방 나가기
    socket.on('leave', async (data) => {
      console.log(data, '방 나가기');
      const socket_id = socket.id;
      const { chat_id, user_id } = data;
      const user = await Users.findByPk(user_id);

      socket.leave(chat_id); // 해당 chat_id에 퇴장

      console.log('방 입장한 유저 :', user.id, 'socket_id: ', socket_id);
      console.log('방 안에 들어와 있는 socket_id:', socket.adapter.rooms);

      // [3] 방 나가기
      io.to(chat_id).emit('leave', {
        user_id: user.id,
        nick_name: user.nick_name,
      });
    });

    // 브라이저 종료
    socket.on('disconnect', async (data) => {
      console.log('브라이저 종료', data);
      const socket_id = socket.id;
      const { chat_id, user_id } = data;

      await Users.update({ is_login: false }, { where: { socket_id } });

      const user = await Users.findOne({
        where: { socket_id },
        attributes: ['id'],
      });

      io.to(chat_id).emit('disconnect', {
        user_id: user.id,
        nick_name: user.nick_name,
      });
      socket.leave();
    });

    //     socket.broadcast.emit('new message', {
    //       username: '안녕',
    //       message: data,
    //     });
    //   });

    // // send_message 이벤트 수신
    // socket.on("send_message", async (data) => {
    //     const message = new chatMessage(data); // 받은 메시지 DB 저장
    //     // console.log(message);
    //     message.save().then(() => {
    //         // 해당 roomId로 receive_message 이벤트 송신
    //         io.in(data.roomId).emit("receive_message", {
    //             ...data,
    //             id: message._id,
    //         });
    //         console.log("data: ", data);
    //         console.log("data.roomId: ", data.roomId);
    //         // notify 이벤트 송신(알림 메시지 전송)
    //         io.emit("notify", data);
    //         console.log(`${data.senderNick}님이 메시지를 보냈습니다.`);
    //     });
    // });

    // // back 이벤트 수신(채팅방 뒤로가기)
    // socket.on("back", (data) => {
    //     socket.leave(data);
    //     console.log(`User with ID: ${socket.id} left room: ${data}`);
    // });

    // // 연결 중지
    // socket.on("disconnect", () => {
    //     console.log("User Disconnected", socket.id);
    // });
  });
};
