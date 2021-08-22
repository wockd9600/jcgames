"use strict"
const ioChat = io('/chat');

const XSSinspecter = content => (content.includes('\&') || content.includes('\<') || content.includes('\>') || content.includes('\"') || content.includes('\'') || content.includes('\/')) ? true : false;


//DOM
const setNameForm = document.querySelector('.inputName');
const chatInput = document.querySelector(".chatting-input");
const chatname = document.querySelector('#input-chatname');

//button
const setNameButton = document.querySelector('.set-name');
const snedMsgButton = document.querySelector(".send-msg");

//display
const chatList = document.querySelector(".chatting-list");
const displayContainer = document.querySelector(".display-container");
const displayUserList = document.querySelector('.userList');



// event
setNameButton.addEventListener('click', () => {
    if(chatname.value === ''){
        alert('이름을 입력해주세요.');
    }else if(chatname.value.includes(' ')){
        alert('공백 포함 불가');
    }else if(XSSinspecter(chatname.value)){
        alert('특수 문자 포함 불가');
    }else{
        ioChat.emit('setName', chatname.value);
    }
});
const sendMsg = () => ioChat.emit("send-msg", XSSfilter(chatInput.value));
snedMsgButton.addEventListener('click', sendMsg);
chatInput.addEventListener("keypress", (e)=>{
    if(event.keyCode == 13 && chatInput.value != ''){
        sendMsg();
    }
});


//socket
ioChat.on('fail-connect', (name) => {
   alert(`${name}은 이미 사용 중인 별명입니다.`);
});
//get 
ioChat.on('chat-userList', (data) => {
    const {docs, name} = data;
    docs.forEach((value) => {
        let li = document.createElement('li');
        li.innerText = value.id;
        displayUserList.appendChild(li);
    });
    setNameForm.style.display = "none";
});
//get ID of New User
ioChat.on('chat-newUser', (name) => {
    console.log(name);
    let li = document.createElement('li');
    li.innerText = name;
    displayUserList.appendChild(li);
});

ioChat.on("receive-msg", (data)=>{
    const { name, msg, time} = data;
    const item = new LiModel(name, msg, time);
    item.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight)
    chatInput.value = '';
})

function LiModel(name, msg, time){
    this.name = name;
    this.msg = msg;
    this.time = time;
    this.makeLi = ()=>{
        const li = document.createElement("li");
        li.classList.add(nickname.value === this.name ? "sent" : "received");
        const dom = `<span class="profile">
        <span class="user">${this.name}</span>
        </span>
        <span class="message">${this.msg}</span>
        <span class="time">${this.time}</span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    }
}