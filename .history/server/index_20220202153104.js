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
const users = {
    'Public': [{ username: "John Auto", id: "kadnfifh8" }, { username: "Maria Auto", id: "rtert4kadnfifh8" }],
    'Public-2': [{ username: "David Auto", id: "kadnf234ifh8" }, { username: "Cindy Auto", id: "rtertdf4kadnfifh8" }, { username: "Caroline Auto", id: "r3213tert4kadnfifh8" }],
}
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

    socket.on('logout', () => {
        socket.disconnect()
    })

    socket.on('disconnect', () => {

        const ind = allClientsSocket.indexOf(socket);
        // console.log('User Disconnected', socket.id, allClientsDatas[ind])
        if (ind !== -1) {
            if (allClientsDatas[ind].room) {
                socket.to(allClientsDatas[ind].room).emit('logout-chatter', allClientsDatas[ind].username, allClientsDatas[ind].id)
                removeUserById(allClientsDatas[ind].room, allClientsDatas[ind].id)
            }
        }
        allClientsSocket.splice(ind, 1)
        allClientsDatas.splice(ind, 1)
    })

    socket.on('get-rooms', (callback) => {
        const rooms = []
        for (let room in users) {
            rooms.push({ name: room, usersTotal: users[room].length })
        }
        console.log(callback, rooms)
        if (typeof callback === 'function')
            callback(rooms)
        else
            io.to(socket.id).emit('receive-rooms', rooms)
    })
})

server.listen(3001, () => {
    console.log('Servidor pronto')
})