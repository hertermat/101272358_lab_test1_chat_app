const express = require('express');
const socketio = require('socket.io');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

const botName = 'Chat Bot';
const messageFormat = require('./utils/formatMessage');
const {getCurrentUser, newUser, userLeave, getRoomUsers} = require('./utils/user');
const io = socketio(server);


app.use(express.static(path.join(__dirname,'public')));

const PORT = 3000;

io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) =>{

        const user = newUser(socket.id, username, room)
        socket.join(user.room);

        socket.emit('message', messageFormat(botName, 'Welcome to the Chat'));

        socket.broadcast.to(user.room).emit('message',messageFormat(botName, `${user.username} joined the chat`))

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    })
    
    

    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', messageFormat(user.username,msg));
    })

    socket.on('disconnect',() =>{

        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', messageFormat(botName, `${user.username} has left the Chat`));

            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

        
    });


})



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));