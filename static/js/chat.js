'use strict';

const socket = io();

// 닉네임
const nickname = document.querySelector('#nickname');
const chat = document.querySelector('#chat');
const chatList = document.querySelector('.chatting-list');
const chatInput = document.querySelector('.chatting-input');
const sendButton = document.querySelector('.send-button');
const joinButton = document.querySelector('.join-button');
const leaveButton = document.querySelector('.leave-button');
const offButton = document.querySelector('.off-button');
const displayContainer = document.querySelector('.display-container');

// 메세지 보내기 ------------------->
sendButton.addEventListener('click', () => {
  const param = {
    chat_id: chat.value,
    // user_id: 2,
    user_id: nickname.value,
    message: chatInput.value,
  };
  // [1] 메세지 보내기
  socket.emit('chatting', param); // param은 백엔드 콘솔에 찍힘.
});

// [4] 메세지 보내기
socket.on('chatting', (data) => {
  console.log(data, '메세지 보내기');
  const { user_id, nick_name, profile_image_url, message, time } = data;
  const item = new LiModel(
    user_id,
    nick_name,
    profile_image_url,
    message,
    time
  );
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

// <------------------- 메세지 보내기

// 메세지 레이아웃
function LiModel(user_id, nick_name, profile_image_url, message, time) {
  this.user_id = user_id;
  this.nick_name = nick_name;
  this.profile_image_url = profile_image_url;
  this.message = message;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement('li');
    console.log(nickname.value == this.user_id, nickname.value, this.user_id);

    li.classList.add(nickname.value == this.user_id ? 'sent' : 'received');
    const dom = `<span clss="profile">
    <span class="user"> ${this.nick_name} </span>
  </span>
  <span class="message">${this.message}</span>
  <span class="time">${this.time} </span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

// 방 입장 레이아웃
function EnterModel(nick_name) {
  this.nick_name = nick_name;

  this.makeLi = () => {
    const li = document.createElement('li');
    li.classList.add('info');
    const dom = `<span class="info"> ${this.nick_name}님이 들어왔습니다.</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

// 방 나가기 레이아웃
function LeaveModel(nick_name) {
  this.nick_name = nick_name;

  this.makeLi = () => {
    const li = document.createElement('li');
    li.classList.add('info');
    const dom = `<span class="info"> ${this.nick_name}님이 나가셨습니다.</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

// 방 입장하기 ------------------->
joinButton.addEventListener('click', () => {
  const param = {
    chat_id: chat.value,
    user_id: nickname.value,
  };

  // [1] 방 입장하기
  socket.emit('join', param);
});

// [4] 방 입장하기
socket.on('join', (data) => {
  console.log(data, '방 입장하기');
  const { user_id, nick_name, message, time } = data;
  const item = new EnterModel(nick_name);
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

// <------------------- 방 입장하기

// 방 나가기 ------------------->
leaveButton.addEventListener('click', () => {
  const param = {
    chat_id: chat.value,
    user_id: nickname.value,
  };

  // [1] 방 나가기
  socket.emit('leave', param);
});

// [4] 방 나가기
socket.on('leave', (data) => {
  console.log(data, '방 나가기');
  const { user_id, nick_name, message, time } = data;
  const item = new LeaveModel(nick_name);
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

// <------------------- 방 나가기

// 브라우저 종료 ------------------->
offButton.addEventListener('click', () => {
  const param = {
    chat_id: chat.value,
    user_id: nickname.value,
  };
  // [1] 브라우저 종료
  socket.emit('disconnect', param);
});

// [4] 브라우저 종료
socket.on('disconnect', (data) => {
  console.log(data, '브라우저 종료');
  const { user_id, nick_name } = data;
  const item = new LeaveModel(nick_name);
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

// <------------------- 브라우저 종료
