const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');

const imageproductValidation = require('../middlewares/validation/image.validate')

const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')
const productImagesModel = require('../models/productImage.model')
const productDescriptionModel = require('../models/productDescription.model')
const auctionModel = require('../models/auction.model')
const auctionStatusModel = require('../models/auctionStatus.model')

const productValidation = require('../middlewares/validation/product.validate')
const auctionValidation = require('../middlewares/validation/auction.validate')
const auctionStatusValidation = require('../middlewares/validation/auctionStatus.validate')

const successCode = 0
const errorCode = 1

router.post('/cancle', auctionStatusValidation.cancle, async (req, res) => {
	const { prodId } = req.body
	const { accId } = req.account

	const checkBidderAuctionExist = await auctionStatusModel.findByBidderAndProduct(accId, prodId)

	if (checkBidderAuctionExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const auctionStatusInfo = {
		stt_is_cancle: 1,
		stt_updated_date: presentDate 
	}

	await auctionStatusModel.update(checkBidderAuctionExist[0].stt_id, auctionStatusInfo)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
