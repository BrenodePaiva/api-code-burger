// const {Router} = require("express")
import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import ProductController from './app/controllers/ProductController'
import CategoryController from './app/controllers/CategoryController'
import OrderController from './app/controllers/OrderController'

import authMiddleware from './app/middlewares/auth'
import DataBase from './database'
import isAdmin from './app/middlewares/isAdmin'

const routes = new Router()
const upload = multer(multerConfig)

routes.get('/', (req, res) => {
  DataBase.connection
    .authenticate()
    .then(() => {
      return res.send(
        `🚀 Server started on port: ${3000} <br/> <br/> 
        ✅ Connection to the database stablished successfully.`
      )
    })
    .catch((error) => {
      return res.send('❌ Error connecting to database: ', error)
    })
})

routes.post('/users', UserController.store)

routes.post('/sessions', SessionController.store)

routes.post('/forgot-password', SessionController.forgotPass)

routes.get('/auth/google/url', SessionController.googleUrl)
routes.get('/auth/google/callback', SessionController.googleCallback)

routes.use(authMiddleware)
routes.put('/users/:email', UserController.update)

routes.get('/products', ProductController.index)

routes.get('/categories', CategoryController.index)

routes.post('/orders', OrderController.store)
routes.get('/orders/:user', OrderController.index)

routes.use(isAdmin)
routes.post('/products', upload.single('file'), ProductController.store)
routes.put('/products/:id', upload.single('file'), ProductController.update)

routes.post('/categories', upload.single('file'), CategoryController.store)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.put('/orders/:id', OrderController.update)
routes.delete('/orders/:id', OrderController.del)

export default routes
