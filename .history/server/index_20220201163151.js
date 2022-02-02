const express = require('express')
const app = express()
const http = require('http')
const { Server } = rquire('socket.io')
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

server.listen(3001, () => {
    console.log('Servidor pronto')
})