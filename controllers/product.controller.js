const express = require('express')
const router = express.Router()
const moment = require('moment');

const knex = require('../utils/dbConnection')

const productValidation = require('../middlewares/validation/product.validate')
const productModel = require('../models/product.model')
const categoriesModel = require('../models/categories.model')
const productImageModel = require('../models/productImage.model')

const successCode = 0
const errorCode = 1

router.get('/list', productValidation.queryInfo, async (req, res) => {
	const { page, limit } = req.query

	const allCategories = await categoriesModel.findAll()
	const allProducts = await productModel.findAll()
	const listCategoriesFather = await categoriesModel.findFather()
	
	const result = await Promise.all([
		listCategoriesFather.map((item) => {
			const listChild = allCategories.filter((info) => info.cate_father === item.cate_id)
			
			return {
				cateId: item.cate_id,
				cateName: item.cate_name,
				subCategories: listChild.map((itemChild) => {
					const listProduct = allProducts.filter((productInfo) => productInfo.prod_cate_id === itemChild.cate_id)

					const convertListProduct = listProduct.map((element) => {
						return {
							prodId: element.prod_id,
							prodName: element.prod_name,
							prodCateId: element.prod_cate_id,
							prodOfferNumber: element.prod_offer_number,
							prodBeginPrice: element.prod_begin_price,
							prodStepPrice: element.prod_step_price,
							prodBuyPrice: element.prod_buy_price,
							createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
							expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
						}
					})

					return {
						cateId: itemChild.cate_id,
						cateName: itemChild.cate_name,
						createDate: moment(new Date(itemChild.cate_created_date)).format('YYYY-MM-DD HH:mm:ss'),
						expireDate: moment(new Date(itemChild.cate_expired_date)).format('YYYY-MM-DD HH:mm:ss'),
						listProduct: convertListProduct
					}
				})
			}
		})
	])
	
	if (result) {
		result[0].sort((a, b) => a - b)
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
				listProducts: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listProducts: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listProducts: [],
		statusCode: errorCode
	})
})

router.get('/list-time-out', async (req, res) => {
	const allProduct = await productModel.findAll()

	const listFilter = allProduct.filter((item) => {

		const productExpire = moment(new Date(item.prod_expired_date))

		if (moment().year() === productExpire.year() && moment().month() === productExpire.month() && moment().date() === productExpire.date() && (moment().hour() + 1) === productExpire.hour()) {
			return true
		}
		
		return false
	}).sort((a, b) => a.prod_expired_date - b.prod_expired_date)

	if (listFilter.length > 0) {
		const result = listFilter.map((element) => {
			return {
				prodId: element.prod_id,
				prodName: element.prod_name,
				prodCateId: element.prod_cate_id,
				prodOfferNumber: element.prod_offer_number,
				prodBeginPrice: element.prod_begin_price,
				prodStepPrice: element.prod_step_price,
				prodBuyPrice: element.prod_buy_price,
				createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
				expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
			}
		}).slice(0, 5)
	
		return res.status(200).json({
			listTimeOut: result,
			statusCode: successCode
		})
	}

	
	return res.status(200).json({
		listTimeOut: allProduct.slice(0, 5),
		statusCode: successCode
	})
})

router.get('/list-biggest-offer', async (req, res) => {
	const allProduct = await productModel.findAll()

	const listFilter = allProduct.sort((a, b) => b.prod_offer_number - a.prod_offer_number)

	const result = listFilter.map((element) => {
		return {
			prodId: element.prod_id,
			prodName: element.prod_name,
			prodCateId: element.prod_cate_id,
			prodOfferNumber: element.prod_offer_number,
			prodBeginPrice: element.prod_begin_price,
			prodStepPrice: element.prod_step_price,
			prodBuyPrice: element.prod_buy_price,
			createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
			expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
		}
	}).slice(0, 5)

	return res.status(200).json({
		listBiggestOffer: result,
		statusCode: successCode
	})
})

router.get('/list-biggest-price', async (req, res) => {
	const allProduct = await productModel.findAll()

	const listFilter = allProduct.sort((a, b) => b.prod_begin_price - a.prod_begin_price)

	const result = listFilter.map((element) => {
		return {
			prodId: element.prod_id,
			prodName: element.prod_name,
			prodCateId: element.prod_cate_id,
			prodOfferNumber: element.prod_offer_number,
			prodBeginPrice: element.prod_begin_price,
			prodStepPrice: element.prod_step_price,
			prodBuyPrice: element.prod_buy_price,
			createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
			expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
		}
	}).slice(0, 5)

	return res.status(200).json({
		listBiggestPrice: result,
		statusCode: successCode
	})
})

router.post('/list-with-cate', productValidation.listWithCate, async (req, res) => {
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

router.post('/details', async (req, res) => {
	const { prodId } = req.body

	var date = new Date();
	var prod = await knex('tbl_product')
		.where('prod_id', id)

	if (prod.length === 0) {
		return res.status(400).json({
			errorMessage: " Product record doesn't exist!",
			statusCode: 1
		})
	}

	var prodObject = {}
	const prodResult = await knex.from('tbl_product')
		.where('prod_id', id)
		.returning('*')
		.then(async (rows) => {
			prodObject = rows[0];

			var imageResult = await knex.from('tbl_product_images')
				.where('prod_img_product_id', prodObject.prod_id);
			prodObject['prod_img'] = imageResult.map(attr => attr.prod_img_data);
		})
	if (prodObject) {
		return res.status(200).json({
			listProductDetail: prodObject,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listProductDetail: [],
		statusCode: errorCode
	})
})

router.post('/search', productValidation.productSearching, async (req, res) => {
	const { prodName } = req.body
	const { limit, page } = req.query

	const prodImages = await productImageModel.findAll()

	//FULL TEXT SEARCH
	let prodListInfo = await knex.raw(`with product as (
		SELECT *
		FROM tbl_product
		WHERE ts @@ to_tsquery('english', '${prodName}')
		order by prod_created_date desc
	)
	select pr.* from product pr`)

	if (prodListInfo.rows.length > 0) {
		prodListInfo = prodListInfo.rows

		const result = prodListInfo.map((element) => {
			const prodImageInfo = prodImages.filter((item) => item.prod_img_product_id === element.prod_id).map((info) => {
				return {
					prodImgId: info.prod_img_id,
					prodImgProductId: info.prod_img_product_id,
					prodImgData: info.prod_img_data
				}
			})
	
			return {
				prodId: element.prod_id,
				prodName: element.prod_name,
				prodCateId: element.prod_cate_id,
				prodOfferNumber: element.prod_offer_number,
				prodBeginPrice: element.prod_begin_price,
				prodStepPrice: element.prod_step_price,
				prodBuyPrice: element.prod_buy_price,
				prodImages: prodImageInfo,
				createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
				expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
			}
		})
	
		return res.status(200).json({
			listProducts: result,
			statusCode: successCode
		})
	}
	
	return res.status(200).json({
		listProducts: [],
		statusCode: successCode
	})
})

module.exports = router
