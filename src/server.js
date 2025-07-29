// const app = require("./app")
import { Server } from 'socket.io'
import http from 'http'
import app from './app'
import orderSocket from './sockets/orderSocket'

const port = process.env.PORT || 3000

// app.listen(port)

// console.log(`🚀 Server started on port: ${(port, '0.0.0.0')}`)

// const io = new Server(server, {
//   cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
// })

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
})

app.set('io', io)
io.on('connection', (socket) => orderSocket(socket, io))

server.listen(port, () => console.log(`🚀 Server started on port: ${port}`))
