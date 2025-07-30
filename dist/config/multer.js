"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _uuid = require('uuid');
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

const upload = _path2.default.resolve(__dirname, '..', '..', 'uploads')

exports. default = {
  directory: upload,
  storage: _multer2.default.diskStorage({
    destination: upload,
    filename: (request, file, callback) => {
      return callback(null, _uuid.v4.call(void 0, ) + _path.extname.call(void 0, file.originalname))
    },
  }),
}
