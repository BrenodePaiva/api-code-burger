import { v4 } from 'uuid'
import * as Yup from 'yup'

import User from '../models/User'

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
    const userExist = await User.findOne({
      where: { email },
    })

    if (userExist) {
      return response.status(409).json({ error: 'User already exist' })
    }

    // create user
    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    })
    return response.status(201).json({ id: user.id, name, email, admin })
  }
}

export default new UserController()
