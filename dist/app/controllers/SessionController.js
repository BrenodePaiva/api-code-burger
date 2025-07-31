"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Userjs = require('../models/User.js'); var _Userjs2 = _interopRequireDefault(_Userjs);
var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _googlejs = require('../../config/google.js');

var _uuid = require('uuid');
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
require('dotenv/config');
var _googleapis = require('googleapis');
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _Emailjs = require('../../utils/Email.js'); var _Emailjs2 = _interopRequireDefault(_Emailjs);
var _sequelize = require('sequelize');

class SessionController {
  // information session
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    })

    const userIncorrect = () => {
      response
        .status(401)
        .json({ error: 'Make sure your password and email are correct' })
    }

    // information is valid ?
    if (!(await schema.isValid(request.body))) return userIncorrect()

    const { email, password } = request.body

    // find user
    const user = await _Userjs2.default.findOne({
      where: { email },
    })

    if (!user || user.google_id) return userIncorrect()

    // password correct ?
    if (!(await user.checkPassword(password))) return userIncorrect()

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: _jsonwebtoken2.default.sign(
        { id: user.id, name: user.name },
        process.env.SESSION_SECRET,
        {
          expiresIn: process.env.SESSION_EXPIRES,
        }
      ),
    })
  }

  // ____________________________________________________________________

  async googleUrl(request, response) {
    const url = _googlejs.oauth2client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['profile', 'email'],
    })

    return response.json({ url })
  }

  // ___________________________________________________________________

  async googleCallback(request, response) {
    try {
      const { code } = request.query

      const { tokens } = await _googlejs.oauth2client.getToken(code)
      _googlejs.oauth2client.setCredentials(tokens)

      const oauth2 = _googleapis.google.oauth2({ version: 'v2', auth: _googlejs.oauth2client })
      const { data } = await oauth2.userinfo.get()

      // Aqui você pode salvar o usuário no banco, criar JWT etc.
      const { name, email, id } = data
      let user = await _Userjs2.default.findOne({ where: { email } })

      if (!user) {
        await _Userjs2.default.create({
          id: _uuid.v4.call(void 0, ),
          name,
          email,
          password: _crypto2.default.randomBytes(4).toString('hex'),
          google_id: id,
        })

        user = await _Userjs2.default.findOne({ where: { email } })
      }

      // response.status(200).json({
      //   id: user.id,
      //   email,
      //   name: user.name,
      //   admin: user.admin,
      //   token: jwt.sign(
      //     { id: user.id, name: user.name },
      //     process.env.SESSION_SECRET,
      //     {
      //       expiresIn: process.env.SESSION_EXPIRES,
      //     }
      //   ),
      // })
      const token = _jsonwebtoken2.default.sign(
        { id: user.id, name: user.name },
        process.env.SESSION_SECRET,
        {
          expiresIn: process.env.SESSION_EXPIRES,
        }
      )
      // Depois redirecione para a sua aplicação (React), com ou sem token na URL
      return response.redirect(
        `${process.env.API_CONSUMER}/?email=${user.email}&name=${user.name}&token=${token}&id=${user.id}&google=${_optionalChain([user, 'optionalAccess', _ => _.google_id])}`
      )
    } catch (error) {
      return response.redirect(`${process.env.API_CONSUMER}/?error=google-auth`)
    }
  }

  // ___________________________________________________________________

  async forgotPass(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    })

    try {
      await schema.validateSync(request.body)
    } catch (err) {
      return response.status(400).json({ Error: err })
    }

    // const { email } = request.body
    const email = _optionalChain([request, 'access', _2 => _2.body, 'access', _3 => _3.email, 'optionalAccess', _4 => _4.trim, 'call', _5 => _5(), 'access', _6 => _6.toLowerCase, 'call', _7 => _7()])
    let htmlmail

    const user = await _Userjs2.default.findOne({ where: { email } })
    if (!user) {
      htmlmail = _fs2.default.readFileSync(
        _path2.default.join(__dirname, '..', '..', 'utils', 'mailerror.html'),
        'utf8'
      )
      const text =
        'não conseguimos identificar um usuário associado a este endereço de e-mail.'
      htmlmail = htmlmail.replace('[text]', text)

      try {
        await _Emailjs2.default.call(void 0, {
          to: email,
          subject: 'Redefinir Senha',
          htmlmail,
          category: 'Reset Password Erro',
        })
        return response.status(404).json({ message: 'E-mail not found' })
      } catch (err) {
        return response
          .status(500)
          .json({ Error: 'There is a error sending e-mail. ' + err })
      }
    } else if (user.google_id) {
      htmlmail = _fs2.default.readFileSync(
        _path2.default.join(__dirname, '..', '..', 'utils', 'mailerror.html'),
        'utf8'
      )
      const text =
        'o método utilizado para o cadastro deste e-mail não permite a redefinição de senha.'
      htmlmail = htmlmail.replace('[text]', text)

      try {
        await _Emailjs2.default.call(void 0, {
          to: email,
          subject: 'Redefinir Senha',
          htmlmail,
          category: 'Reset Password Erro',
        })
        return response.status(401).json({ message: 'Unauthorized action' })
      } catch (err) {
        return response
          .status(500)
          .json({ Error: 'There is a error sending e-mail. ' + err })
      }
    }

    const resetToken = user.createResetPasswordToken()
    await user.save({ validate: false })

    const resetUrl = `${process.env.API_CONSUMER}/resetar-senha/${resetToken}`

    htmlmail = _fs2.default.readFileSync(
      _path2.default.join(__dirname, '..', '..', 'utils', 'mail.html'),
      'utf8'
    )

    htmlmail = htmlmail.replace('[linkButton]', resetUrl)

    try {
      await _Emailjs2.default.call(void 0, {
        to: email,
        subject: 'Redefinir Senha',
        htmlmail,
        category: 'Reset Password',
      })
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions, no-sequences
      ;(user.pass_reset_token = null), (user.pass_reset_token_expires = null)
      user.save({ validate: false })

      return response
        .status(500)
        .json({ Error: 'There is a error sending e-mail. ' + err })
    }
    return response.status(200).json({ message: 'password reset link send' })
  }

  // ___________________________________________________________________________

  async resetPass(request, response) {
    const token = _crypto2.default
      .createHash('sha256')
      .update(request.params.token)
      .digest('hex')

    const date = Date.now()
    const user = await _Userjs2.default.findOne({
      where: {
        pass_reset_token: token,
        pass_reset_token_expires: {
          [_sequelize.Sequelize.Op.gt]: new Date(date), // Converte para um objeto Date
        },
      },
    })

    if (!user) {
      return response.status(400).json({
        message: `Token is invalid or has expired!`,
      })
    } else if (user.google_id) {
      return response.status(401).json({
        message: `Unauthorized action!`,
      })
    }

    const schema = Yup.object().shape({
      password: Yup.string().required().min(6),
    })

    try {
      await schema.validateSync(request.body)
    } catch (err) {
      return response.status(400).json({ Error: err })
    }

    const { password } = request.body

    // eslint-disable-next-line no-unused-expressions, no-sequences
    ;(user.password = password), (user.pass_reset_token = null)
    user.pass_reset_token_expires = null
    user.save()

    return response.status(200).json({ message: 'The password has changed' })
  }
}

exports. default = new SessionController()
