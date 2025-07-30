"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class User extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        password: _sequelize2.default.VIRTUAL,
        password_hash: _sequelize2.default.STRING,
        pass_reset_token: _sequelize2.default.STRING,
        pass_reset_token_expires: _sequelize2.default.DATE,
        admin: _sequelize2.default.BOOLEAN,
        google_id: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    )

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await _bcryptjs2.default.hash(user.password, 10)
      }
    })

    this.addHook('beforeUpdate', async (user) => {
      if (user.password) {
        user.password_hash = await _bcryptjs2.default.hash(user.password, 10)
      }
    })

    return this
  }

  checkPassword(password) {
    return _bcryptjs2.default.compare(password, this.password_hash)
  }

  createResetPasswordToken() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.pass_reset_token = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    this.pass_reset_token_expires = Date.now() + 10 * 60 * 1000

    console.log({
      Token: resetToken,
      HashToken: this.pass_reset_token,
    })

    return resetToken
  }
}

exports. default = User
