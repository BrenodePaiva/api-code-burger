import Sequelize from 'sequelize'

import User from '../app/models/User'
import Product from '../app/models/Product'
import Category from '../app/models/Category'

import ConfigDatabase from '../config/database'
import Order from '../app/models/Order'
import OrderItems from '../app/models/OrderItems'

const models = [User, Product, Category, Order, OrderItems]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(ConfigDatabase)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }
}

export default new Database()
