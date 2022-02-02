const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const ORIGIN = "http://localhost:3000"

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ORIGIN,
        methods: ['GET', 'POST']
    }
})

const RECORD_MESSAGES = true;
const RECORD_USERS = true;
const messages = {}
const users = {}
const allClientsSocket = []
const allClientsDatas = []

const removeUserById = (room, id) => {
    users[room] = users[room].filter(el => el.id !== id)
}
const removeUserByUserName = (room, username) => {
    users[room] = users[room].filter(el => el.username !== username)
}

io.on('connection', (socket) => {
    const id = socket.handshake.query.id
    console.log('User Connected ', socket.id, id)
    allClientsSocket.push(socket)
    allClientsDatas.push(0)

    socket.on('join_room', (data, username) => {
        console.log(`Room ${data} joined by ${socket.id}`)
        socket.join(data)
        socket.to(data).emit('new-chatter', username, socket.id)
        if (RECORD_MESSAGES)
            io.to(socket.id).emit('receive-conversation', messages[data])
        if (RECORD_USERS) {
            // console.log('recording users...', users[data])
            io.to(socket.id).emit('receive-users', users[data])
            if (!users[data])
                users[data] = []
            removeUserById(data, socket.id)
            users[data].push({ username, id: socket.id })

            var i = allClientsSocket.indexOf(socket);
            allClientsDatas[i] = { username, id: socket.id, room: data }
        }
    })

    socket.on('send-message', data => {
        // console.log('send-message', data)
        socket.to(data.room).emit('receive-message', data)
        if (!messages[data.room])
            messages[data.room] = []
        messages[data.room].push(data)
    })

    socket.on('logout', (room, username) => {
        if (room) {
            socket.to(room).emit('logout-chatter', username, socket.id)
            removeUserById(room, socket.id)
        }

        socket.disconnect()
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)

        var i = allClientsSocket.indexOf(socket);
        allClientsSocket.splice(i, 1)
    })
})

server.listen(3001, () => {
    console.log('Servidor pronto')
})