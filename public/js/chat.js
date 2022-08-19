const chatMsg = document.querySelector('.chat-msg')
const input = document.querySelector('#sendButton').previousElementSibling;
const URLparameters = new URLSearchParams(location.search);
const socket = io();

socket.on('msg', (msg) => {
  document.querySelector('.typingStatus').innerHTML = '';
  insertTheMsg(msg);
})

socket.on('typingAlert', (msg) => {
  document.querySelector('.typingStatus').innerHTML = msg;
})

socket.on('removeTypingAlert', () => {
  document.querySelector('.typingStatus').innerHTML = '';
})

document.querySelector('#sendButton').addEventListener('click', (e) => {
  if (e.target.previousElementSibling.value !== '') {
    socket.emit('message', { name: URLparameters.get('name'), msg: e.target.previousElementSibling.value });
  }
})

input.addEventListener('keyup', () => {
  console.log(input.value.length)
  if (input.value.length == 0) {
    isNotTyping();
  }
  else {
    isTyping();
  }
})


function insertTheMsg(msg) {
  let currentMsg = document.createElement('div');
  currentMsg.style.marginBottom = '10px';
  currentMsg.style.display = 'inline-block';
  currentMsg.style.maxWidth = '300px';
  currentMsg.innerHTML = `
    <div style="background-color:#55efc4;width: fit-content;padding:10px;border-radius: 10px;font-family: sans-serif;max-width:inherit;">
        ${msg.msg}
    </div>
    <div style="display:flex;flex-direction:row;justify-content: flex-end;font-size: 12px;color:#b2bec3;">
        <div style="margin:5px 2px;font-family:sans-serif">
            <b>${msg.name == URLparameters.get('name') ? ('you') : (msg.name)}</b>
        </div>
        <div style="margin:5px 2px;font-family:sans-serif;color:#b2bec3;">
            <b>${msg.time}</b>
        </div>
    </div>
    `
  chatMsg.appendChild(currentMsg);
  let lineBreak = document.createElement('br');
  chatMsg.appendChild(lineBreak);

  clearInput();
}

function clearInput() {
  input.value = '';
}

function isTyping() {
  let username = URLparameters.get('name');
  socket.emit('typing', `${username} is typing...`);
}

function isNotTyping() {
  socket.emit('notTyping');
}