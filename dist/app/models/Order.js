"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Order extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        status: _sequelize2.default.STRING,
      },
      { sequelize }
    )
    return this
  }

  static associate(model) {
    this.belongsTo(model.User, {
      foreignKey: 'user_id',
      as: 'user',
    })
  }
}

exports. default = Order
