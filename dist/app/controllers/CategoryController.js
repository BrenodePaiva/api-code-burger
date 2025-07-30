"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Categoryjs = require('../models/Category.js'); var _Categoryjs2 = _interopRequireDefault(_Categoryjs);
// import User from '../models/User'

class CategoryController {
  // information category
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
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

    const { name } = request.body

    // category exist
    const categoryExist = await _Categoryjs2.default.findOne({
      where: { name },
    })

    if (categoryExist) {
      return response.status(400).json({ error: 'Category already exist' })
    }

    // create category
    const { filename: path } = request.file
    const category = await _Categoryjs2.default.create({ name, path })

    return response.json({ id: category.id, name, path })
  }

  // ___________________________________________________________________________

  // list category
  async index(request, response) {
    const categories = await _Categoryjs2.default.findAll()
    return response.json(categories)
  }

  // ___________________________________________________________________________

  // update category
  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    })

    try {
      await schema.validateSync(request.body)
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    // const { admin: isAdmin } = await User.findByPk(request.userId)

    // if (!isAdmin) {
    //   return response.status(401).json()
    // }

    const { id } = request.params
    let category = await _Categoryjs2.default.findByPk(id)

    if (!category) {
      return response.status(404).json({ message: 'Category not found' })
    }

    // updating category
    let path
    if (request.file) {
      path = request.file.filename
    }
    const { name } = request.body

    await _Categoryjs2.default.update(
      {
        name,
        path,
      },
      { where: { id } }
    )
    category = await _Categoryjs2.default.findByPk(id)
    return response.json(category)
  }
}

exports. default = new CategoryController()
