"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _routesjs = require('./routes.js'); var _routesjs2 = _interopRequireDefault(_routesjs);
var _path = require('path');
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
require('./database/index.js');
require('dotenv/config');

class App {
  constructor() {
    this.app = _express2.default.call(void 0, )
    this.app.use(
      _cors2.default.call(void 0, {
        origin: process.env.API_CONSUMER,
        methods: ['GET', 'POST', 'PATCH', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    )
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(_express2.default.json())
    this.app.use(
      '/product-file',
      _express2.default.static(_path.resolve.call(void 0, __dirname, '..', 'uploads'))
    )
    this.app.use(
      '/category-file',
      _express2.default.static(_path.resolve.call(void 0, __dirname, '..', 'uploads'))
    )
  }

  routes() {
    this.app.use(_routesjs2.default)
  }
}

exports. default = new App().app
