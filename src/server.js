// const app = require("./app")
import { Server } from 'socket.io'
import http from 'http'
import app from './app.js'
import orderSocket from './sockets/orderSocket.js'
import 'dotenv/config'

const port = process.env.PORT

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.API_CONSUMER,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
})

app.set('io', io)
io.on('connection', (socket) => orderSocket(socket, io))

server.listen(port, () => console.log(`🚀 Server started on port: ${port}`))
