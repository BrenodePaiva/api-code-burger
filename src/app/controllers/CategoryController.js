import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

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
    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { name } = request.body

    // category exist
    const categoryExist = await Category.findOne({
      where: { name },
    })

    if (categoryExist) {
      return response.status(400).json({ error: 'Category already exist' })
    }

    // create category
    const { filename: path } = request.file
    const category = await Category.create({ name, path })

    return response.json({ id: category.id, name, path })
  }

  // list category
  async index(request, response) {
    const categories = await Category.findAll()
    return response.json(categories)
  }

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

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { id } = request.params
    let category = await Category.findByPk(id)

    if (!category) {
      return response.status(404).json({ message: 'Category not found' })
    }

    // updating category
    let path
    if (request.file) {
      path = request.file.filename
    }
    const { name } = request.body

    await Category.update(
      {
        name,
        path,
      },
      { where: { id } }
    )
    category = await Category.findByPk(id)
    return response.json(category)
  }
}

export default new CategoryController()
