#!/usr/bin/env node

/**
 * Module dependencies.
 */

 const app = require('./server');
 const debug = require('debug')('myapp:server');
const mongoose = require('mongoose');

require('dotenv').config({path:"./variables.js"});

const ioServer = require('./socket')(app);
 
 /**
  * Get port from environment and store in Express.
  */
 const port = normalizePort(process.env.PORT || '8001');
 app.set('port', port);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
  ioServer.listen(port, (err)=>{
    if(err){
        return console.log(err);
    }
    else{
        mongoose.connect(`mongodb+srv://p_is_myname:jaechang@practicegame.8htv4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true},
        (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('connected to db');
            }
        });
    }
});
 ioServer.on('error', onError);
 ioServer.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   const port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   const bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   const addr = ioServer.address();
   const bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }
 