const express = require('express') 
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const accountValidation = require('../middlewares/validation/account.validate')

const accountModel = require('../models/account.model')
const productModel = require('../models/product.model')
const watchModel = require('../models/watch.model')


const watchValidation = require('../middlewares/validation/watch.validate')

const successCode = 0
const errorCode = 1

router.get('/list', watchValidation.queryInfo, async (req, res) => {
	const { page, limit } = req.query
	const { accId } = req.account

	const listWatch = await watchModel.findByAcc(accId)

	if (listWatch.length === 0) {
		return res.status(200).json({
			errorMessage: 'Customer Does Not Have Any Product In Watch List'
		})
	}
	const listProduct = await productModel.findAll()

	const result = await Promise.all([
		listWatch.map((item) => {
			const productInfo = listProduct.find((info) => info.prod_id === item.watch_prod_id)

			if (productInfo) {
				return {
					prodId: productInfo.prod_id,
					prodName: productInfo.prod_name,
					prodCateId: productInfo.prod_cate_id,
					prodOfferNumber: productInfo.prod_offer_number,
					prodBeginPrice: productInfo.prod_begin_price,
					prodStepPrice: productInfo.prod_step_price,
					prodBuyPrice: productInfo.prod_buy_price,
					createDate: moment(productInfo.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
					expireDate: moment(productInfo.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
				}
			}

			return res.status(400).json({
				errorMessage: 'Some Product In Cart Is Invalid'
			})
		})
	])

	if (result) {
		if (result.length === 0) {
			return res.status(500).json({
				statusCode: errorCode
			})
		}

		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listWatch: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			listWatch: result[0],
			statusCode: successCode
		})
	}
	
	return res.status(200).json({
		listWatch: [],
		statusCode: successCode
	})
})

router.post('/add', watchValidation.addWatch, async (req, res) => {
    const { prodId } = req.body
	const { accId } = req.account

	const productInfo = await productModel.findById(prodId)

	if (productInfo.length === 0) {
		return res.status(400).json({
			errorMessage: 'Product Does Not Exist',
			statusCode: errorCode
		})
	}

	const checkExist = await watchModel.findByAccAndProduct(accId, prodId)
	const presentDate = new Date()

	if (checkExist.length === 0) {


		const newWatch = {
			watch_acc_id: accId,
			watch_prod_id: prodId,
			watch_created_date: presentDate,
			watch_updated_date: presentDate
		}

		const returnInfo = await watchModel.addWatch(newWatch)

		return res.status(200).json({
			watchId: returnInfo,
			statusCode: successCode
		})
	}

	return res.status(400).json({
		errorMessage: `Product Has Already In Watch List`,
		statusCode: successCode
	})
})

router.post('/delete', watchValidation.deleteWatch, async (req, res) => {
	const { watchId } = req.body

	const checkExist = await watchModel.findById(watchId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Watch List Id'
		})
	}

	await knex('tbl_watch').where({ watch_id: watchId }).del()
	
	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
