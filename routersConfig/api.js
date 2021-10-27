const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const authenticateCategoriesController = require('../controllers/authenticateCategories.controller')
const sellerController = require('../controllers/seller.controller')
const bidderController = require('../controllers/bidder.controller')
const commentController = require('../controllers/comment.controller')
const auctionController = require('../controllers/auction.controller')
const watchListController = require('../controllers/watch.controller')

API.use('/account', accountController)
API.use('/auth-categories', authenticateCategoriesController)
API.use('/seller', sellerController)
API.use('/bidder', bidderController)
API.use('/comment', commentController)
API.use('/auction', auctionController)
API.use('/watch-list', watchListController)


module.exports = API
