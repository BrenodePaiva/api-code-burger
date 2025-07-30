"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Userjs = require('../models/User.js'); var _Userjs2 = _interopRequireDefault(_Userjs);

exports. default = async (request, response, next) => {
  try {
    const { admin: isAdmin } = await _Userjs2.default.findByPk(request.userId)

    if (!isAdmin) {
      return response
        .status(401)
        .json({ error: 'Access denied: Administrators only' })
    }
    return next()
  } catch (error) {
    return response.status(500).json({ error: 'Error checking permissions' })
  }
}
