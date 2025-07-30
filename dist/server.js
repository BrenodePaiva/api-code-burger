"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// const app = require("./app")
var _socketio = require('socket.io');
var _http = require('http'); var _http2 = _interopRequireDefault(_http);
var _appjs = require('./app.js'); var _appjs2 = _interopRequireDefault(_appjs);
var _orderSocketjs = require('./sockets/orderSocket.js'); var _orderSocketjs2 = _interopRequireDefault(_orderSocketjs);

const port = process.env.PORT

// app.listen(port)

// console.log(`🚀 Server started on port: ${(port, '0.0.0.0')}`)

// const io = new Server(server, {
//   cors: { origin: 'http://localhost:3001', methods: ['GET', 'POST'] },
// })

const server = _http2.default.createServer(_appjs2.default)
const io = new (0, _socketio.Server)(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
})

_appjs2.default.set('io', io)
io.on('connection', (socket) => _orderSocketjs2.default.call(void 0, socket, io))

server.listen(port, () => console.log(`🚀 Server started on port: ${port}`))
