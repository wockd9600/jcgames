"use strict"
const socket = io('/keyword');

// DOM
const keyword1 = document.querySelector('.keyword1');
const keyword2 = document.querySelector('.keyword2');
const keywordInput = document.querySelector('#keyword-input');

// Button
const keywordButton = document.querySelector('.submit');
const startButton = document.querySelector('.start');

// Display
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');

let answer = 'asudhfijsiodpdjsafiljjfsdjafoj';
let nextAnswer = 'ajsoidjfojsidasdjfjiosdfjfiosjdf';

//모바일도 가능하게

// start
startButton.addEventListener('click',()=> {
    socket.emit("keyword-start");
    keywordInput.focus();
    startButton.style.visibility = 'hidden';
});
// input keyword
keywordButton.addEventListener('click', (e)=>{
    e.preventDefault();
    socket.emit("keyword-input", keywordInput.value);
    keywordInput.value = '';
});

// get next keyword
socket.on("keyword-next", (nextkeyword) => {
    answer = nextAnswer;
    nextAnswer = nextkeyword;
    keyword1.innerText = answer;
    keyword2.innerText = nextAnswer;
});
// get score
socket.on("keyword-score", (score) => scoreDisplay.innerText = score);
// get time
socket.on("keyword-time", (time) => {
    timeDisplay.innerText = time;
    if(time > 5){
        return;
    } else if(0 < time && time <= 5){
        timeDisplay.style.color = "red";
    } else if(time === 0){ // 제한 시간이 0초가 되었을 때
        let record = document.querySelector("#submit-score");
        record.style.display = "block";
        timeDisplay.style.color = "black";
        timeDisplay.innerText = 10;
        scoreDisplay.innerText = 0;
        startButton.style.visibility = 'visible';
    }
});