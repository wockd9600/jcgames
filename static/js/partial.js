"use strict"
const ioRanking = io(`/ranking`);

function noEvent() { // 새로 고침 방지
    if (event.keyCode == 116) {
        event.keyCode = 2;
        return false;
    } else if (event.ctrlKey
            && (event.keyCode == 78 || event.keyCode == 82)) {
        return false;
    }
}
document.onkeydown = noEvent;

setTimeout(() => {
    ioRanking.emit('join', game);
}, 2000);

const XSSfilter = content=> content.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27').replace(/\//g, '&#x2F');


// DOM
let client_name = document.querySelector('#name');
let client_job = document.querySelector('#job');
let client_content = document.querySelector('#content');

let userList = document.querySelector(".userlist");
let myRank = document.querySelector('.myRank');
let ranking = document.querySelector('.ranking');

let layer = document.querySelector('#submit-score');

let ranklength = 0;

client_name.addEventListener("keydown", (e)=>{
    if(e.target.value.length >= 5){
        e.target.value = e.target.value.substr(0, 5);
    }
});
client_job.addEventListener("keydown", (e)=>{
    if(e.target.value.length >= 5){
        e.target.value = e.target.value.substr(0, 5);
    }
});
client_content.addEventListener("keydown", (e)=>{
    if(e.target.value.length >= 28){
            e.target.value = e.target.value.substr(0, 28);
    }
});


// ranking function
function cancelRecord(){
    layer.style.display = 'none';
    client_name.value = '';
    client_job.value = '';
    client_content.value = '';
}
function writeRanking(result, game) {
    userList.innerHTML = '';
    switch (game) {
        case 'keyword':
            result.sort((a, b) => {
                return b.score - a.score;
            });
            break;
        case 'puzzle':
            result.sort((a, b) => {
                return a.score - b.score;
            });
            break;
    }
    result.forEach((r, idx) => {
        let rank = document.createElement('h6');
        rank.innerText = idx + 1;
        ranklength = idx + 1;
        ranking.append(rank);

        let li = document.createElement("li");
        li.classList.add("td");
        li.setAttribute('data-score', r["score"]);
        for(let key in r) {
            if(key === '_id') continue;
            let p = document.createElement("p");
            p.innerText = r[key];
            li.appendChild(p);
        }
        userList.appendChild(li);
    });
}

function getRanking(game){
    $.ajax({
        url:`/practice/${game}/ajax`,
        data: {},
        type:"get",
        success:function(result){
            writeRanking(result, game);
        }
    });
}

function sendRecord(game) {
    let temp_record = 0;
    switch (game) {
        case 'puzzle':
            temp_record = time;
            break;
    }
    myRank.innerHTML = '<h6></h6>';

    let obj = {name: XSSfilter(client_name.value.slice(0, 5)), job: XSSfilter(client_job.value.slice(0, 5)),
               score: temp_record, content: XSSfilter(client_content.value.slice(0, 28)) }
    ioRanking.emit("insert", {obj, game});
    cancelRecord();
}

ioRanking.on('myRecord', (obj) => {
    for (let key in obj) {
        if(key === '_id') continue;
        let p = document.createElement("p");
        p.innerText = obj[key];
        myRank.appendChild(p);
    }
});
ioRanking.on('newRecord', (data) => {
    const { obj, game } = data;
    let rank = document.createElement('h6');
    rank.innerText = ranklength + 1;
    ranking.append(rank);

    let myScore = obj.score;
    let nowRecords = [...userList.children];
    let idxNode = nowRecords[nowRecords.length];
    let isLast = true;
    switch(game){
        case 'keyword':
            for(let record of nowRecords){
                let score = Number(record.getAttribute('data-score'));
                if(score >= myScore) continue;
                isLast = false;
                idxNode = record;
                break;
            }
            break;
        case 'puzzle':
            for(let record of nowRecords){
                let score = Number(record.getAttribute('data-score'));
                if(score <= myScore) continue;
                isLast = false;
                idxNode = record;
                break;
            }
            break;
    }
    let li = document.createElement("li");
    li.classList.add("td");
    li.classList.add("myRank");
    li.setAttribute('data-score', obj.score);
    for (let key in obj) {
        if(key === '_id') continue;
        let p = document.createElement("p");
        p.innerText = obj[key];
        li.appendChild(p);
    }
    isLast ? userList.appendChild(li) : idxNode.before(li);
});