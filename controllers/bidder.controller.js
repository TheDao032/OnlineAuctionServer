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

router.post('/offer', auctionStatusValidation.cancle, async (req, res) => {
	const { prodId, aucPriceOffer } = req.body
	const { accId } = req.account

	const listBidder = await auctionStatusModel.findByProdId(prodId)
	const prodInfo = await productModel.findById(prodId)

	if (prodInfo.length === 0) {
		return res.status(200).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	if (listBidder.length === 0) {
		if (prodInfo[0].prod_begin_price <= aucPriceOffer) {

			const auctionInfo = {
				auc_prod_id: prodId,
				auc_bidder_id: accId,
				auc_price_offer: aucPriceOffer,
				auc_created_date: presentDate,
				auc_updated_date: presentDate
			}
			await auctionModel.create(auctionInfo)

			const auctionStatusInfo = {
				stt_bidder_id: accId,
				stt_prod_id: prodId,
				stt_is_biggest: 0,
				stt_biggest_price: aucPriceOffer,
				stt_created_date: presentDate,
				stt_updated_date: presentDate
			}

			await auctionStatusModel.create(auctionStatusInfo)

			return res.status(200).json({
				statusCode: successCode
			})
		}


		return res.status(400).json({
			errorMessage: `Offer Price Is Smaller Than Begin Price Of Product`,
			statusCode: errorCode
		})
	}

	const biggestBidder = listBidder.find((item) => item.stt_is_biggest === 0)

	const biggesPrice = await auctionModel.findByBidderAndProduct(biggestBidder.stt_bidder_id, biggestBidder.stt_prod_id)

	if ((biggestBidder.stt_biggest_price + prodInfo[0].prod_step_price) <= aucPriceOffer) {
		if (biggesPrice.auc_price_offer < aucPriceOffer) {
			const updateBiggest = {
				stt_is_biggest: 1,
				stt_updated_date: presentDate
			}

			await auctionStatusModel.update(biggestBidder.stt_id, updateBiggest)
			
			const bidderInfo = await auctionStatusModel.findByBidderAndProduct(accId, prodId)

			if (bidderInfo.length === 0) {
				const auctionStatusInfo = {
					stt_bidder_id: accId,
					stt_prod_id: prodId,
					stt_is_biggest: 0,
					stt_biggest_price: biggesPrice[0].auc_price_offer + prodInfo[0].prod_step_price,
					stt_created_date: presentDate,
					stt_updated_date: presentDate
				}
	
				await auctionStatusModel.create(auctionStatusInfo)
			} else {
				const auctionStatusInfo = {
					stt_is_biggest: 0,
					stt_biggest_price: biggesPrice[0].auc_price_offer + prodInfo[0].prod_step_price,
					stt_updated_date: presentDate
				}
	
				await auctionStatusModel.update(bidderInfo[0].stt_id, auctionStatusInfo)
			}

			const auctionInfo = {
				auc_prod_id: prodId,
				auc_bidder_id: accId,
				auc_price_offer: aucPriceOffer,
				auc_created_date: presentDate,
				auc_updated_date: presentDate
			}
			await auctionModel.create(auctionInfo)
		} else {
			return res.status(400).json({
				errorMessage: `Someone's'Money Offering Is Bigger Than Your`,
				statusCode: errorCode
			})
		}
	} else {
		return res.status(400).json({
			errorMessage: `Step Price Has To Be As Least ${prodInfo[0].prod_step_price}`,
			statusCode: errorCode
		})
	}

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
