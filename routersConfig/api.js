const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const authenticateCategoriesController = require('../controllers/authenticateCategories.controller')
const sellerController = require('../controllers/seller.controller')

API.use('/account', accountController)
API.use('/auth-categories', authenticateCategoriesController)
API.use('/seller', sellerController)

module.exports = API
