const socket = io()

const url = new URLSearchParams(window.location.search)
const username = url.get('username')
const room = url.get('room')

const usernameDiv = document.getElementById('username')
usernameDiv.textContent = `Olá ${username} - Você está na sala ${room}`

socket.emit('user_room', {
  username,
  room
}, (messages) => {
  messages.forEach((message) => {
    const isMyMessage = message.username === username && message.room === room

    createMessage(message, isMyMessage)
  })
})

document.getElementById('message').addEventListener('keypress', (event) => {
  if (event.key !== 'Enter') {
    return
  }

  const message = event.target.value

  socket.emit('message', {
    content: message,
    username,
    room
  })

  event.target.value = ''
})

socket.on('message', data => {
  const isMyMessage = data.username === username && data.room === room

  createMessage(data, isMyMessage)
})

function createMessage(data, isMyMessage = false) {
  const messagesDiv = document.getElementById('messages')
  
  messagesDiv.innerHTML += `
  <div id="new_message" class="${isMyMessage && 'my-message'}">
      <strong>${data.username}</strong>
      <span>${data.content} - ${dayjs(data.createdAt).format('HH:mm DD/MM')}</span>
  </div>
  `
}

document.getElementById('logout').addEventListener('click', (event) => {
  window.location.href = '/'
})