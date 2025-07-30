"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class OrderItems extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        unit_price: _sequelize2.default.DECIMAL,
        quantity: _sequelize2.default.INTEGER,
      },
      { sequelize }
    )
    return this
  }

  static associate(model) {
    this.belongsTo(model.Order, {
      foreignKey: 'order_id',
      as: 'order',
    })

    this.belongsTo(model.Product, {
      foreignKey: 'product_id',
      as: 'product',
    })
  }
}

exports. default = OrderItems
