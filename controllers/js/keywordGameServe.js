const fs = require('fs');

class keywordGameServe{
    constructor(){
        this.keywordList = this.getKeywordList();
        this.keyword = 'asudhfijsiodpjfsdjafoj';
        this.nextkeyword = 'ajsoidjfojsidjfiosjdf';
        this.level = 2000;
        this.time = 10;
        this.score = 0;
        this.interval;
        this.isPlaying = false;
        this.socket;
    }
    gameStart(socket){
        clearInterval(this.interval);
        this.socket = socket;
        this.isPlaying = true;
        this.time = 10;
        this.score = 0;
        this.getNextKeyword();
        this.getNextKeyword();
        this.level = 2000;
        this.interval = setInterval(() => this.countDown(), this.level);
    }
    isRight(userkeyword){
        if (this.isPlaying && userkeyword === this.keyword){
            this.score++;
            this.time++;
            if(this.score % 20 === 0){
                this.changeLevel();
            }
            if(this.time>20){
                this.time--;
                this.score++;
            }
            this.socket.emit("keyword-score", this.score);
            this.socket.emit("keyword-time", this.time);
            this.getNextKeyword();
        }
    }

    
    getKeywordList(){
        let idx = Math.floor(Math.random()*10) % 58;
        return fs.readFileSync(__dirname + `/keywordfile/words/wordList${idx}.txt`, 'utf8').split(" ");
    }
    getNextKeyword(){
        this.keyword = this.nextkeyword;
        this.nextkeyword = this.keywordList[Math.floor(Math.random()*100) % (this.keywordList.length-1)];
        this.socket.emit("keyword-next", this.nextkeyword);
    }
    changeLevel(){
        this.keywordList = this.getKeywordList();
        clearInterval(this.interval);
        this.level > 1000 ? this.level -= 500 : this.level -= 100;
        if(this.level <= 500) this.level = 500;
        this.interval = setInterval(() => this.countDown(), this.level);
    }
    countDown(){
        this.time--;
        this.socket.emit("keyword-time", this.time);
        if(this.time > 0) return;
        this.isPlaying = false;
        clearInterval(this.interval);
    }
}

module.exports = keywordGameServe;