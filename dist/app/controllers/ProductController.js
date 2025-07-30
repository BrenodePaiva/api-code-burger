"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _Productjs = require('../models/Product.js'); var _Productjs2 = _interopRequireDefault(_Productjs);
var _Categoryjs = require('../models/Category.js'); var _Categoryjs2 = _interopRequireDefault(_Categoryjs);

var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

class ProductController {
  // information product
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    })

    // information is valid ?
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    // Verify user admin
    // const { admin: isAdmin } = await User.findByPk(request.userId)

    // if (!isAdmin) {
    //   return response.status(401).json()
    // }

    const { filename: path } = request.file
    const { name, price, category_id, offer } = request.body

    try {
      // create product
      const product = await _Productjs2.default.create({
        name,
        price,
        category_id,
        offer,
        path,
      })

      return response.status(200).json(product)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  // ____________________________________________________________________

  // list products with category name
  async index(request, response) {
    const products = await _Productjs2.default.findAll({
      include: [
        {
          model: _Categoryjs2.default,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })
    return response.json(products)
  }

  // update products
  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    // const { admin: isAdmin } = await User.findByPk(request.userId)

    // if (!isAdmin) {
    //   return response.status(401).json()
    // }

    const { id } = request.params
    let product = await _Productjs2.default.findByPk(id)

    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    let path
    if (request.file) {
      await _fs2.default.promises.unlink(product.path)
      path = request.file.filename
    }
    const { name, price, category_id, offer } = request.body

    try {
      await _Productjs2.default.update(
        {
          name,
          price,
          category_id,
          offer,
          path,
        },
        { where: { id } }
      )

      product = await _Productjs2.default.findByPk(id)
      return response.status(200).json(product)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  // ____________________________________________________________________

  async delete(request, response) {
    const { id } = request.params

    try {
      await _Productjs2.default.destroy({ where: { id } })
      return response.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      return response.status(500).json(error)
    }
  }
}

exports. default = new ProductController()
