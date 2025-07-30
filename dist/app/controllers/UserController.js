"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _uuid = require('uuid');
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _Userjs = require('../models/User.js'); var _Userjs2 = _interopRequireDefault(_Userjs);

class UserController {
  // information user
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    })

    // information is valid ?
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name, email, password, admin } = request.body

    // user exist ?
    const userExist = await _Userjs2.default.findOne({
      where: { email },
    })

    if (userExist) {
      return response.status(409).json({ error: 'User already exist' })
    }

    try {
      // create user
      const user = await _Userjs2.default.create({
        id: _uuid.v4.call(void 0, ),
        name,
        email,
        password,
        admin,
      })
      return response.status(201).json({ id: user.id, name, email, admin })
    } catch (error) {
      return response.status(500).json({ Erro: error })
    }
  }

  // ______________________________________________________________________

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string(),
      newPassword: Yup.string().when('password', {
        is: (val) => val && val.length !== 0,
        then: (schema) => schema.required().min(6),
      }),
    })

    // information is valid ?
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      console.log(err)
      return response.status(400).json({ error: err.errors })
    }

    const { email } = request.params
    const { name, password, newPassword } = request.body

    let user = await _Userjs2.default.findOne({
      where: { email },
    })

    try {
      if (password && newPassword && !user.google_id) {
        if (!(await user.checkPassword(password))) {
          console.log('password eRRado')
          return response
            .status(401)
            .json({ message: 'Make sure your password are correct' })
        }
        await _Userjs2.default.update(
          {
            name,
            password: newPassword,
          },
          { where: { email } }
        )
      } else {
        await _Userjs2.default.update(
          {
            name,
          },
          { where: { email } }
        )
      }

      user = await _Userjs2.default.findOne({ where: { email } })

      return response.status(200).json({ id: user.id, name, email })
    } catch (error) {
      return response.status(500).json({ Error: error })
    }
  }
}

exports. default = new UserController()
