const express = require('express');
const app = express();
const http = require('http');
const socket = require('socket.io');
const moment = require('moment');

app.use((express.static('public')));

const server = http.createServer(app);

const io = socket(server);

io.on('connection',socket =>{

    socket.on('message',(msg)=>{
        io.sockets.emit('msg',{
            ...msg,
            time:moment().format('h:mm a')
        }); 
    })

    socket.on('typing',(msg)=>{
        socket.broadcast.emit('typingAlert',msg);
    })

    socket.on('notTyping',(msg)=>{
        socket.broadcast.emit('removeTypingAlert',msg);
    })

})

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`server running at port ${PORT}`);  
})