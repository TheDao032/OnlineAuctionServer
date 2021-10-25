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

router.post('/list-auction', auctionValidation.listAuction, async (req, res) => {
    const { prodId } = req.body
	const { page, limit } = req.query
	const ts = req.query.ts || 0

	const listProduct = await productModel.findAll()

	let loop = 0

	const fn = async () => {
		const listBidder = await auctionStatusModel.findByProdIdWithTs(prodId, ts)
		
		if (listBidder.length !== 0) {
			const convertListBidder = listBidder.map((element) => {
				const prodInfo = listProduct.find((item) => item.prod_id === element.stt_prod_id)
				return {
					sttId: element.stt_id,
					sttProdName: prodInfo.prod_name,
					sttProdId: element.stt_prod_id,
					sttBidderId: element.stt_bidder_id,
					sttBiggestPrice: element.stt_biggest_price
				}
			})
			convertListBidder.sort((a, b) => a.sttBiggestPrice - b.sttBiggestPrice)
			if (page && limit) {
				let startIndex = (parseInt(page) - 1) * parseInt(limit)
				let endIndex = (parseInt(page) * parseInt(limit))
				let totalPage = Math.floor(convertListBidder.length / parseInt(limit))

				if (convertListBidder.length % parseInt(limit) !== 0) {
					totalPage = totalPage + 1
				}
		
				const paginationResult = convertListBidder.slice(startIndex, endIndex)
		
				return res.status(200).json({
					totalPage,
					listAuctions: paginationResult,
					return_ts: moment().unix(),
					statusCode: successCode
				})
			}
			
			return res.status(200).json({
				listAuctions: convertListBidder,
				return_ts: moment().unix(),
				statusCode: successCode
			})
		} else {
			loop++;

			if (loop < 4) {
				setTimeout(fn, 5000)
			} else {
				return res.status(200).json({
					listAuctions: [],
					return_ts: moment().unix(),
					statusCode: successCode
				})
			}
		}
	}

	await fn()
})

module.exports = router