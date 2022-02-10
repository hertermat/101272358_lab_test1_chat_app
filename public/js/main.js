const chat = document.getElementById('chat-form')
const socket = io();
const chatBar = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinedRoom', {username, room})

socket.on('roomUsers', ({room,users}) => {
    outputRooomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message)

    chatBar.scrollTop = chatBar.scrollHeight;

})

chat.addEventListener('submit', (i) => {
    i.preventDefault();

    const msg = i.target.elements.msg.value;
    
    socket.emit('chatMessage', msg);

    i.target.elements.msg.value = '';
    i.target.elements.msg.focus();
})

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRooomName(room){
    roomName.innerText = room;
    
}

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}