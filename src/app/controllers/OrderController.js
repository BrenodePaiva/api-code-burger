import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
  // information order
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    })

    // order is valid ?
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const productsId = request.body.products.map((product) => product.id)

    const orderProduct = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    })

    const editedProduct = orderProduct.map((product) => {
      const productIndex = request.body.products.findIndex(
        (index) => index.id === product.id
      )

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity,
      }
      return newProduct
    })

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: editedProduct,
      status: 'Pedido realizado',
    }

    const createOrder = await Order.create(order)

    return response.status(201).json(createOrder)
  }

  // Find all prduct
  async index(request, response) {
    const allOrders = await Order.find()

    return response.json(allOrders)
  }

  // Update product
  async update(request, response) {
    const { id } = request.params
    const { status } = request.body

    const schema = Yup.object().shape({
      status: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body)
      await Order.updateOne({ _id: id }, { status })
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }

    // Verify user admin
    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) {
      return response.status(401).json()
    }

    return response.json({ message: 'status was updated' })
  }
}

export default new OrderController()
