import { io } from './http'

interface User {
  socketId: string
  username: string
  room: string
} 

interface UserData {
  username: string
  room: string
} 

interface Message {
  username: string
  room: string
  content: string
  createdAt: Date
}

interface MessageData {
  username: string
  room: string
  content: string
}

const users: User[] = []
const messages: Message[] = []

io.on('connection', (socket) => {

  socket.on('user_room', ({ username, room }: UserData, callback) => {
    socket.join(room)

    const userInRoom = users.find((user) => user.username === username && user.room === room)

    if (userInRoom) {
      userInRoom.socketId = socket.id
    } else {
      users.push({
        socketId: socket.id,
        username,
        room
      })
    }

    const messagesByRoom = getMessagesByRoom(room)
    callback(messagesByRoom)
  })

  socket.on('message', ({ username, room, content }: MessageData) => {
    const message = {
      username,
      room,
      content,
      createdAt: new Date()
    }

    messages.push(message)

    io.to(room).emit('message', message)
  })
})

function getMessagesByRoom(room: string) {
  return messages.filter((message) => message.room === room)
}