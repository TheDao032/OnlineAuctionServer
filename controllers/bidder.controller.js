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
const commentModel = require('../models/comment.model')
const auctionPermissionModel = require('../models/auctionPermission.model')
const accountModel = require('../models/account.model')

const productValidation = require('../middlewares/validation/product.validate')
const auctionValidation = require('../middlewares/validation/auction.validate')
const auctionStatusValidation = require('../middlewares/validation/auctionStatus.validate')

const mailService = require('../services/mailService')
const mailOptions = require('../template/mailOptions')

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

router.post('/offer', auctionStatusValidation.offer, async (req, res) => {
	const { prodId, aucPriceOffer } = req.body
	const { accId } = req.account

	const listVote = await commentModel.findByToId(accId)
	const accountInfo = await accountModel.findById(accId)

	const prodInfo = await productModel.findById(prodId)
	const sellerInfo = await accountModel.findById(prodInfo[0].prod_acc_id)

	if (listVote.length !== 0) {

		const checkPositive = listVote.filter((item) => item.cmt_vote === 1)

		if (checkPositive.length * 100 / parseFloat(listVote.length) > 80) {

			const listBidder = await auctionStatusModel.findByProdId(prodId)

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

					const productInfo = {
						prod_offer_number: prodInfo[0].prod_offer_number + 1,
						prod_updated_date: presentDate
					}

					await productModel.update(productInfo, prodInfo[0].prod_id)

					await mailService.sendMail(mailOptions.offerSuccessOwnerOptions(accountInfo[0].acc_email, accountInfo[0].acc_email, prodInfo[0].prod_name), req, res)

					await mailService.sendMail(mailOptions.offerSuccessOptions(sellerInfo[0].acc_email, sellerInfo[0].acc_email, prodInfo[0].prod_name), req, res)

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

			const biggestPrice = await auctionModel.findByBidderAndProduct(biggestBidder.stt_bidder_id, biggestBidder.stt_prod_id)
			const sortByOfferPrice = biggestPrice.sort((a, b) => b.auc_price_offer - a.auc_price_offer)

			if ((biggestBidder.stt_biggest_price + prodInfo[0].prod_step_price) <= aucPriceOffer) {
				if (sortByOfferPrice[0].auc_price_offer < aucPriceOffer) {
					const lastBiggest = await accountModel.findById(biggestBidder.stt_bidder_id)

					const updateBiggest = {
						stt_is_biggest: 1,
						stt_updated_date: presentDate
					}

					await auctionStatusModel.updateWithProdId(biggestBidder.stt_prod_id, updateBiggest)
					
					const auctionStatusInfo = {
						stt_bidder_id: accId,
						stt_prod_id: prodId,
						stt_is_biggest: 0,
						stt_biggest_price: sortByOfferPrice[0].auc_price_offer + prodInfo[0].prod_step_price,
						stt_created_date: presentDate,
						stt_updated_date: presentDate
					}

					await auctionStatusModel.create(auctionStatusInfo)

					const auctionInfo = {
						auc_prod_id: prodId,
						auc_bidder_id: accId,
						auc_price_offer: aucPriceOffer,
						auc_created_date: presentDate,
						auc_updated_date: presentDate
					}
					await auctionModel.create(auctionInfo)

					await mailService.sendMail(mailOptions.offerSuccessOwnerOptions(accountInfo[0].acc_email, accountInfo[0].acc_email, prodInfo[0].prod_name), req, res)

					await mailService.sendMail(mailOptions.offerSuccessOptions(sellerInfo[0].acc_email, sellerInfo[0].acc_email, prodInfo[0].prod_name), req, res)

					await mailService.sendMail(mailOptions.offerSuccessOptions(lastBiggest[0].acc_email, lastBiggest[0].acc_email, prodInfo[0].prod_name), req, res)

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
		}

		return res.status(400).json({
			errorMessage: `Have To Many Bad Vote`,
			statusCode: errorCode
		})
	}

	const checkPermission = await auctionPermissionModel.findByBidderAndProduct(accId, prodId)
	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	if (checkPermission.length === 0) {
		const aucPermissionInfo = {
			per_bidder_id: accId,
			per_seller_id: prodInfo[0].prod_acc_id,
			per_prod_id: prodId,
			per_can_auction: 1,
			per_created_date: presentDate,
			per_updated_date: presentDate
		}

		await auctionPermissionModel.create(aucPermissionInfo)

		return res.status(400).json({
			errorMessage: `First Time Offer For This Product, Wait For Permission From Seller`,
			statusCode: errorCode
		})
	} else {
		if (checkPermission[0].per_can_auction === 0) {
			const listBidder = await auctionStatusModel.findByProdId(prodId)

			if (prodInfo.length === 0) {
				return res.status(200).json({
					errorMessage: `Invalid Product Id`,
					statusCode: errorCode
				})
			}

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

					const productInfo = {
						prod_offer_number: prodInfo[0].prod_offer_number + 1,
						prod_updated_date: presentDate
					}

					await productModel.update(productInfo, prodInfo[0].prod_id)

					await mailService.sendMail(mailOptions.offerSuccessOwnerOptions(accountInfo[0].acc_email, accountInfo[0].acc_email, prodInfo[0].prod_name), req, res)

					await mailService.sendMail(mailOptions.offerSuccessOptions(sellerInfo[0].acc_email, sellerInfo[0].acc_email, prodInfo[0].prod_name), req, res)

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

			const biggestPrice = await auctionModel.findByBidderAndProduct(biggestBidder.stt_bidder_id, biggestBidder.stt_prod_id)
			const sortByOfferPrice = biggestPrice.sort((a, b) => b.auc_price_offer - a.auc_price_offer)

			if ((biggestBidder.stt_biggest_price + prodInfo[0].prod_step_price) <= aucPriceOffer) {
				if (sortByOfferPrice[0].auc_price_offer < aucPriceOffer) {
					const updateBiggest = {
						stt_is_biggest: 1,
						stt_updated_date: presentDate
					}

					await auctionStatusModel.updateWithProdId(biggestBidder.stt_prod_id, updateBiggest)
					
					const auctionStatusInfo = {
						stt_bidder_id: accId,
						stt_prod_id: prodId,
						stt_is_biggest: 0,
						stt_biggest_price: sortByOfferPrice[0].auc_price_offer + prodInfo[0].prod_step_price,
						stt_created_date: presentDate,
						stt_updated_date: presentDate
					}

					await auctionStatusModel.create(auctionStatusInfo)

					const auctionInfo = {
						auc_prod_id: prodId,
						auc_bidder_id: accId,
						auc_price_offer: aucPriceOffer,
						auc_created_date: presentDate,
						auc_updated_date: presentDate
					}
					await auctionModel.create(auctionInfo)

					await mailService.sendMail(mailOptions.offerSuccessOwnerOptions(accountInfo[0].acc_email, accountInfo[0].acc_email, prodInfo[0].prod_name), req, res)

					await mailService.sendMail(mailOptions.offerSuccessOptions(sellerInfo[0].acc_email, sellerInfo[0].acc_email, prodInfo[0].prod_name), req, res)

					await mailService.sendMail(mailOptions.offerSuccessOptions(lastBiggest[0].acc_email, lastBiggest[0].acc_email, prodInfo[0].prod_name), req, res)

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
		}

		return res.status(400).json({
			errorMessage: `Don't Have Permission From Seller`,
			statusCode: errorCode
		})
	}
	
})

module.exports = router
