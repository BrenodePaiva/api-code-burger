import Sequelize from 'sequelize'

import User from '../app/models/User'
import Product from '../app/models/Product'
import Category from '../app/models/Category'

import mongoose from 'mongoose'

import ConfigDatabase from '../config/database'

const models = [User, Product, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    this.connection = new Sequelize(ConfigDatabase.url)
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://mongo:7MJ1PTpNBYrFPWQHXCFd@containers-us-west-54.railway.app:5559',
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
  }
}

export default new Database()
