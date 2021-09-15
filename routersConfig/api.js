const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const authenticateCategoriesController = require('../controllers/authenticateCategories.controller')
const authenticateProductController = require('../controllers/authenticateProduct.controller')
const cartController = require('../controllers/cart.controller')

API.use('/account', accountController)
API.use('/cart', cartController)
API.use('/auth-categories', authenticateCategoriesController)
API.use('/auth-product', authenticateProductController)

module.exports = API
