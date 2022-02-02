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

const messages = {}

io.on('connection', (socket) => {
    const id = socket.handshake.query.id
    console.log('User Connected ', socket.id, id)

    socket.on('join_room', (data) => {
        console.log(`Room ${data} joined by ${socket.id}`)
        socket.join(data)
        io.to(socket.id).emit('receive-message', { message: "Welcome!", author: "Automatic", time: '', room: data })
    })
    // socket.on('join_r', (data) => {
    //     console.log(`Room ${data} joined by ${socket.id}`)
    //     socket.join(data)
    //     socket.to(data.room).emit('receive-message', data)
    // })

    socket.on('send-message', data => {
        console.log('send-message', data)
        socket.to(data.room).emit('receive-message', data)
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
    })
})

server.listen(3001, () => {
    console.log('Servidor pronto')
})