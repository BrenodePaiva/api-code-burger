"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

var _Userjs = require('../app/models/User.js'); var _Userjs2 = _interopRequireDefault(_Userjs);
var _Productjs = require('../app/models/Product.js'); var _Productjs2 = _interopRequireDefault(_Productjs);
var _Categoryjs = require('../app/models/Category.js'); var _Categoryjs2 = _interopRequireDefault(_Categoryjs);

var _databasejs = require('../config/database.js'); var _databasejs2 = _interopRequireDefault(_databasejs);
var _Orderjs = require('../app/models/Order.js'); var _Orderjs2 = _interopRequireDefault(_Orderjs);
var _OrderItemsjs = require('../app/models/OrderItems.js'); var _OrderItemsjs2 = _interopRequireDefault(_OrderItemsjs);

require('dotenv/config');

const models = [_Userjs2.default, _Productjs2.default, _Categoryjs2.default, _Orderjs2.default, _OrderItemsjs2.default]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new (0, _sequelize2.default)(process.env.DB_URL, { ConfigDatabase: _databasejs2.default })
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
}

exports. default = new Database()
