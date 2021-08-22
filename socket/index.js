'use strict';

const db = require('../models/index');
const moment = require('moment');

const Record = db.Record;
const ChatLog = db.ChatLog;

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");



const _keywordGameServe = require("../controllers/js/keywordGameServe");
const keywordServe = new _keywordGameServe();


let ioEvents = function(io) {
    //keyword game
	io.of('/keyword').on('connection', (socket) => {
		socket.on('keyword-input', (userKeyword) => keywordServe.isRight(userKeyword));
		socket.on('keyword-start', () => keywordServe.gameStart(socket));
	  });

    //chat
    let chat = io.of('/chat').on('connection', (socket) => {
        socket.on('setName', (name) => {
            if(name === '' || name.includes(' ') || XSSinspecter(name)){
                return;
            }
            socket.username = 'a';
            const docs = ChatLog.find({id: `${name}`}, (err, docs) => {
                if(docs.length >= 1){
                    socket.emit('fail-connect', name);
                    return;
                }else{
                    ChatLog.find({}, (err, docs) => {
                        socket.emit('chat-newUser', name);
                        socket.emit('chat-userList', {docs, name})
                        const user = new ChatLog();
                        user.id = `${name}`;
                        user.log =  'jkl';
                        user.save();
                        chat.to('room').emit('chat-newUser', name);
                        socket.join('room');
                    });
                    socket.username = name;
                }
            });
       });
        socket.on('send-msg', (msg) => chat.to('room').emit('receive-msg',
        {
            name: socket.username,
            msg: XSSfilter(msg),
            time: moment().format('HH:mm')
        }
        ));
        socket.on('disconnect', () => {
            ChatLog.deleteOne({id:socket.username}, (err, docs) => {
                if(err){
                    throw err
                }else{
                    socket.username = 'a'
                }
            });
        });
    });

	//   rank
    let rank = io.of('/ranking').on('connection', (socket) => {
        socket.on('join', (game) => socket.join(game));
        socket.on('insert', (data) => {
            let obj = data.obj;
            let game = data.game;
            let name = XSSfilter(obj.name.slice(0, 5));
            let job = XSSfilter(obj.job.slice(0, 5));
            let score = obj.score;
            let content = XSSfilter(obj.content.slice(0, 28));
            if(game == 'keyword'){
                score = keywordServe.score;
                obj.score = score;
            }
            switch (game) {
                case 'keyword':
                    Record.updateOne(
                        { _id: '60dc5dac394a071760f1842a' },
                        { $push: { keyword: { name, job, score, content } } },
                        (err, docs) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                    break;
                case 'puzzle':
                    Record.updateOne(
                        { _id: '60dc5dac394a071760f1842a' },
                        { $push: { puzzle: { name, job, score, content } } },
                        (err, docs) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                    break;
            }
            socket.emit('myRecord', obj);
            rank.to(game).emit('newRecord', {obj, game});
        });
    })
}


let init = function(app){
	const server = require('http').createServer(app);
	const io = require('socket.io')(server);

	// io.use((socket, next) => {
	// 	require('../session')(socket.request, {}, next);
	// });

	ioEvents(io);

	return server;
}

const XSSfilter = (content)=> content.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&#x27').replace(/\//g, '&#x2F');
const XSSinspecter = content => (content.includes('\&') || content.includes('\<') || content.includes('\>') || content.includes('\"') || content.includes('\'') || content.includes('\/')) ? true : false;


module.exports = init;