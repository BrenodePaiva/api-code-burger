import multer from 'multer'
import { v4 } from 'uuid'
import path, { extname } from 'path'

const upload = path.resolve(__dirname, '..', '..', 'uploads')

export default {
  directory: upload,
  storage: multer.diskStorage({
    destination: upload,
    filename: (request, file, callback) => {
      return callback(null, v4() + extname(file.originalname))
    },
  }),
}
