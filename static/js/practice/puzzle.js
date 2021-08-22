const container = document.querySelector(".puzzle-img");
const playTime = document.querySelector(".time");
const gameText = document.querySelector(".game-text");

const startButton = document.querySelector(".start-button");

const tileCount = 16;
const imgCount = 6;

let tile = [];
const dragged = {
    el: null,
    class: null,
    index: null,
}
let isPlaying = false;
let timeInterval = null;
let startInterval = null;
let time = 0;

const puzzleImg = new Array();
for(let i=0; i<=imgCount; i++){
    puzzleImg[i] = `/img/puzzle/${i}.jpg`;
}

tiles = createImageTile();

// function
function createImageTile() {
    const temp = []
    const tempImg = `url(${randomImage()})`;
    Array(tileCount).fill().forEach((_, idx)=> {
        const li = document.createElement("li");
        li.setAttribute('data-index', idx);
        li.setAttribute('draggable', true);
        li.style.backgroundImage = tempImg;
        li.classList.add(`list${idx}`);
        container.appendChild(li);
        temp.push(li)
    });
    return temp;
}
function randomImage() {
    return puzzleImg[Math.floor(Math.random() * imgCount)];
}
function startGame(){
    isPlaying = true;   
    container.innerHTML = "";
    gameText.style.display = "none";
    tiles = createImageTile();
    time = 5
    startInterval = setInterval(()=>{
        playTime.innerHTML = `${time}초 후에 시작합니다.`;
        time -= 1;
    }, 1000);
    setTimeout(()=> {
        time = 0;
        clearInterval(startInterval);
        setTimeout(()=>{
            container.innerHTML = "";
            shuffle(tiles).forEach(tile=>container.appendChild(tile));
        }, 1000);
        clearInterval(timeInterval);
        timeInterval = setInterval(()=> {
            playTime.innerText = time;
            time++;
        }, 1000);
    }, 5500);
}
function shuffle(arr) {
    let index = arr.length -1;
    while(index > 0){
        const randomIndex = Math.floor(Math.random()*(index+1));
        [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
        index--;
    }
    return arr;
}
function checkPuzzle() {
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index);

    if(unMatchedList.length === 0) {
        let record = document.querySelector("#submit-score");
        record.style.display = "block";
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval);
    }
}


// event
startButton.addEventListener('click', ()=>{
    if(!isPlaying){
        startGame();
    }
});
container.addEventListener('dragstart', e=>{
    if(!isPlaying) return;
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className
    dragged.index = [...obj.parentNode.children].indexOf(obj);
});
container.addEventListener('dragover', e=>{
    e.preventDefault();
});
container.addEventListener('drop', e=>{
    if(!isPlaying) return;
    const obj = e.target;

    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false;
    
        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling
        }else{
            originPlace = dragged.el.previousSibling
            isLast = true;
        }
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkPuzzle();
});
