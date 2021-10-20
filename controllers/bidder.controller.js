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

const productValidation = require('../middlewares/validation/product.validate')
const auctionValidation = require('../middlewares/validation/auction.validate')

const successCode = 0
const errorCode = 1

router.post('/cancle', productValidation.listWithCate, async (req, res) => {
	const { cateId } = req.body
	const { page, limit } = req.query

	const listProduct = await productModel.findByCateId(cateId)

	if (listProduct.length > 0) {
		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(listProduct.length / parseInt(limit))
	
			if (listProduct.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = listProduct.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listProducts: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listProducts: listProduct,
			statusCode: successCode
		})
	}
	
	return res.status(200).json({
		listProducts: [],
		statusCode: successCode
	})
})

module.exports = router