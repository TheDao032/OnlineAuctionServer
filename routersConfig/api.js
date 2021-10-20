const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const authenticateCategoriesController = require('../controllers/authenticateCategories.controller')
const sellerController = require('../controllers/seller.controller')
const bidderController = require('../controllers/bidder.controller')
const commentController = require('../controllers/comment.controller')

API.use('/account', accountController)
API.use('/auth-categories', authenticateCategoriesController)
API.use('/seller', sellerController)
API.use('/bidder', bidderController)
API.use('/comment', commentController)


module.exports = API
