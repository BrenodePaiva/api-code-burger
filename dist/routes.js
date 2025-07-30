"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// const {Router} = require("express")
var _express = require('express');
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);

var _multerjs = require('./config/multer.js'); var _multerjs2 = _interopRequireDefault(_multerjs);

var _UserControllerjs = require('./app/controllers/UserController.js'); var _UserControllerjs2 = _interopRequireDefault(_UserControllerjs);
var _SessionControllerjs = require('./app/controllers/SessionController.js'); var _SessionControllerjs2 = _interopRequireDefault(_SessionControllerjs);
var _ProductControllerjs = require('./app/controllers/ProductController.js'); var _ProductControllerjs2 = _interopRequireDefault(_ProductControllerjs);
var _CategoryControllerjs = require('./app/controllers/CategoryController.js'); var _CategoryControllerjs2 = _interopRequireDefault(_CategoryControllerjs);
var _OrderControllerjs = require('./app/controllers/OrderController.js'); var _OrderControllerjs2 = _interopRequireDefault(_OrderControllerjs);

var _authjs = require('./app/middlewares/auth.js'); var _authjs2 = _interopRequireDefault(_authjs);
var _indexjs = require('./database/index.js'); var _indexjs2 = _interopRequireDefault(_indexjs);
var _isAdminjs = require('./app/middlewares/isAdmin.js'); var _isAdminjs2 = _interopRequireDefault(_isAdminjs);
require('dotenv/config');

const routes = new (0, _express.Router)()
const upload = _multer2.default.call(void 0, _multerjs2.default)

routes.get('/', (req, res) => {
  _indexjs2.default.connection
    .authenticate()
    .then(() => {
      return res.send(
        `🚀 Server started on port: ${process.env.PORT} <br/> <br/> 
        ✅ Connection to the database stablished successfully.`
      )
    })
    .catch((error) => {
      return res.send('❌ Error connecting to database: ', error)
    })
})

routes.post('/users', _UserControllerjs2.default.store)

routes.post('/sessions', _SessionControllerjs2.default.store)

routes.post('/forgot-password', _SessionControllerjs2.default.forgotPass)

routes.get('/auth/google/url', _SessionControllerjs2.default.googleUrl)
routes.get('/auth/google/callback', _SessionControllerjs2.default.googleCallback)

routes.use(_authjs2.default)
routes.put('/users/:email', _UserControllerjs2.default.update)

routes.get('/products', _ProductControllerjs2.default.index)

routes.get('/categories', _CategoryControllerjs2.default.index)

routes.post('/orders', _OrderControllerjs2.default.store)
routes.get('/orders/:user', _OrderControllerjs2.default.index)

routes.use(_isAdminjs2.default)
routes.post('/products', upload.single('file'), _ProductControllerjs2.default.store)
routes.put('/products/:id', upload.single('file'), _ProductControllerjs2.default.update)

routes.post('/categories', upload.single('file'), _CategoryControllerjs2.default.store)
routes.put('/categories/:id', upload.single('file'), _CategoryControllerjs2.default.update)

routes.put('/orders/:id', _OrderControllerjs2.default.update)
routes.delete('/orders/:id', _OrderControllerjs2.default.del)

exports. default = routes
