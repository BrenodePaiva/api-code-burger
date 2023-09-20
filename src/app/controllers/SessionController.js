import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'

import auth from '../../config/auth'

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
    const user = await User.findOne({
      where: { email },
    })

    if (!user) return userIncorrect()

    // password correct ?
    if (!(await user.checkPassword(password))) return userIncorrect()

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    })
  }
}

export default new SessionController()
