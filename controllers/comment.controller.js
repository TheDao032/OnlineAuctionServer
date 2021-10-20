const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');

const productModel = require('../models/product.model')
const accountModel = require('../models/account.model')
const commentModel = require('../models/comment.model')


const commentValidation = require('../middlewares/validation/comment.validate')

const successCode = 0
const errorCode = 1

router.post('/new-comment', commentValidation.newComment, async (req, res) => {
    const { bidderId, cmtContent, cmtVote, prodId } = req.body
    const { accId } = req.account

    const checkBidderExist = await accountModel.findById(bidderId)

    if (checkBidderExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Bidder Id`,
            statusCode: errorCode
        })
    }

    const checkProductExist = await productModel.findById(prodId)

    if (checkProductExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Product Id`,
            statusCode: errorCode
        })
    }
    
    const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

    const commentInfo = {
        cmt_bidder_id: bidderId,
        cmt_seller_id: accId,
        cmt_vote: cmtVote,
        cmt_content: cmtContent,
        cmt_created_date: presentDate,
        cmt_updated_date: presentDate
    }

    await commentModel.create(commentInfo)
    
    return res.status(200).json({
        statusCode: successCode
    })
})

router.post('/bad-comment', commentValidation.badComment, async (req, res) => {
    const { bidderId, prodId, sellerId } = req.body

    const checkBidderExist = await accountModel.findById(bidderId)

    if (checkBidderExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Bidder Id`,
            statusCode: errorCode
        })
    }

    const checkSellerExist = await accountModel.findById(sellerId)

    if (checkSellerExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Bidder Id`,
            statusCode: errorCode
        })
    }

    const checkProductExist = await productModel.findById(prodId)

    if (checkProductExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Product Id`,
            statusCode: errorCode
        })
    }
    
    const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

    const commentInfo = {
        cmt_bidder_id: bidderId,
        cmt_seller_id: sellerId,
        cmt_vote: -1,
        cmt_created_date: presentDate,
        cmt_updated_date: presentDate
    }

    await commentModel.create(commentInfo)
    
    return res.status(200).json({
        statusCode: successCode
    })
})

module.exports = router