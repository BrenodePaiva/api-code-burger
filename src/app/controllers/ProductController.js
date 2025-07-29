import * as Yup from 'yup'

import Product from '../models/Product'
import Category from '../models/Category'
// import User from '../models/User'
import fs from 'fs'

class ProductController {
  // information product
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
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

    const { filename: path } = request.file
    const { name, price, category_id, offer } = request.body

    try {
      // create product
      const product = await Product.create({
        name,
        price,
        category_id,
        offer,
        path,
      })

      return response.status(200).json(product)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  // ____________________________________________________________________

  // list products with category name
  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })
    return response.json(products)
  }

  // update products
  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    // const { admin: isAdmin } = await User.findByPk(request.userId)

    // if (!isAdmin) {
    //   return response.status(401).json()
    // }

    const { id } = request.params
    let product = await Product.findByPk(id)

    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    let path
    if (request.file) {
      await fs.promises.unlink(product.path)
      path = request.file.filename
    }
    const { name, price, category_id, offer } = request.body

    try {
      await Product.update(
        {
          name,
          price,
          category_id,
          offer,
          path,
        },
        { where: { id } }
      )

      product = await Product.findByPk(id)
      return response.status(200).json(product)
    } catch (error) {
      return response.status(500).json(error)
    }
  }

  // ____________________________________________________________________

  async delete(request, response) {
    const { id } = request.params

    try {
      await Product.destroy({ where: { id } })
      return response.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      return response.status(500).json(error)
    }
  }
}

export default new ProductController()
