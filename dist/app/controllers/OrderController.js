"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Productjs = require('../models/Product.js'); var _Productjs2 = _interopRequireDefault(_Productjs);
var _Orderjs = require('../models/Order.js'); var _Orderjs2 = _interopRequireDefault(_Orderjs);
var _Userjs = require('../models/User.js'); var _Userjs2 = _interopRequireDefault(_Userjs);
var _nanoid = require('nanoid');
var _OrderItemsjs = require('../models/OrderItems.js'); var _OrderItemsjs2 = _interopRequireDefault(_OrderItemsjs);

class OrderController {
  // information order
  async store(request, response) {
    const schema = Yup.object().shape({
      user: Yup.string().required(),
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            price: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    })

    // order is valid ?
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { user } = request.body

    try {
      const order = await _Orderjs2.default.create({
        id: _nanoid.nanoid.call(void 0, 12),
        user_id: user,
        status: 'Pedido realizado',
      })

      const items = await Promise.all(
        request.body.products.map(async (product) => {
          const orderItems = await _OrderItemsjs2.default.create({
            order_id: order.id,
            product_id: product.id,
            unit_price: product.price,
            quantity: product.quantity,
          })
          return orderItems
        })
      )

      const allOrders = await _Orderjs2.default.findOne({
        include: [
          {
            model: _Userjs2.default,
            as: 'user',
            attributes: ['name'],
          },
        ],
        where: { id: order.id },
      })

      const allItems = await _OrderItemsjs2.default.findAll({
        include: [
          {
            model: _Productjs2.default,
            as: 'product',
            attributes: ['name', 'url', 'path'],
          },
          {
            model: _Orderjs2.default,
            as: 'order',
            attributes: ['user_id'],
          },
        ],
        where: { order_id: order.id },
      })

      const io = request.app.get('io')

      io.to('kitchen').emit('new-order', {
        order: allOrders,
        items: allItems,
      })

      // io.to('kitchen').emit('updated-all-order', order)

      return response.status(200).json({ order, items })
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  // ___________________________________________________________________

  // Find all prduct
  async index(request, response) {
    const { user } = request.params
    let allOrders
    let items

    if (user !== '0') {
      allOrders = await _Orderjs2.default.findAll({
        include: [
          {
            model: _Userjs2.default,
            as: 'user',
            attributes: ['name'],
          },
        ],
        where: { user_id: user },
        order: [['created_at', 'DESC']],
      })

      items = await _OrderItemsjs2.default.findAll({
        include: [
          {
            model: _Productjs2.default,
            as: 'product',
            attributes: ['name', 'url', 'path'],
          },
          {
            model: _Orderjs2.default,
            as: 'order',
            attributes: ['user_id'],
          },
        ],
        where: { '$order.user_id$': user },
        order: [['created_at', 'DESC']],
      })
    } else {
      allOrders = await _Orderjs2.default.findAll({
        include: [
          {
            model: _Userjs2.default,
            as: 'user',
            attributes: ['name'],
          },
        ],
        order: [['created_at', 'DESC']],
      })

      items = await _OrderItemsjs2.default.findAll({
        include: [
          {
            model: _Productjs2.default,
            as: 'product',
            attributes: ['name', 'url', 'path'],
          },
        ],
        order: [['created_at', 'DESC']],
      })
    }

    return response.status(200).json({ allOrders, items })
  }

  // ____________________________________________________________________

  // Update product
  async update(request, response) {
    const { id } = request.params
    const { status } = request.body

    const schema = Yup.object().shape({
      status: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body)

      const hasOrder = await _Orderjs2.default.update({ status }, { where: { id } })

      if (!hasOrder) {
        return response.status(404).json({ message: 'Order not found' })
      }

      const order = await _Orderjs2.default.findByPk(id)

      const io = request.app.get('io')
      io.to(`client-${order.user_id}`).emit('updated-order', order)

      io.to('kitchen').emit('updated-all-order', order)

      // ⚡ Emitir evento via WebSocket
      // const io = request.app.get('io')
      // io.emit('order-updated', { id: Number(id), status })

      return response.json({ message: 'status was updated' })
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }

    // Verify user admin
    // const { admin: isAdmin } = await User.findByPk(request.userId)
    // if (!isAdmin) {
    //   return response.status(401).json()
    // }
  }

  // ____________________________________________________________________

  async del(request, response) {
    const { id } = request.params

    try {
      await _Orderjs2.default.destroy({ where: { id } })

      const io = request.app.get('io')

      io.to('kitchen').emit('delete-order', id)

      return response.status(200).json({ message: 'Order deleted' })
    } catch (error) {
      return response.status(500).json(error)
    }
  }
}

exports. default = new OrderController()
