const express = require('express')
const router = express.Router()
const moment = require('moment');

const knex = require('../utils/dbConnection')

const productValidation = require('../middlewares/validation/product.validate')
const productModel = require('../models/product.model')
const categoriesModel = require('../models/categories.model')
const productImageModel = require('../models/productImage.model')
const productDescriptionModel = require('../models/productDescription.model')

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
	const prodImages = await productImageModel.findAll()

	const listFilter = allProduct.filter((item) => {

		const productExpire = moment(new Date(item.prod_expired_date))

		if (moment().year() === productExpire.year() && moment().month() === productExpire.month() && moment().date() === productExpire.date() && (moment().hour() + 1) === productExpire.hour()) {
			return true
		}
		
		return false
	}).sort((a, b) => a.prod_expired_date - b.prod_expired_date)

	if (listFilter.length > 0) {
		const result = listFilter.map((element) => {
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
		}).slice(0, 5)
	
		return res.status(200).json({
			listTimeOut: result,
			statusCode: successCode
		})
	}

	const result = allProduct.map((element) => {
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
	}).slice(0, 5)
	
	return res.status(200).json({
		listTimeOut: result,
		statusCode: successCode
	})
})

router.get('/list-biggest-offer', async (req, res) => {
	const allProduct = await productModel.findAll()
	const prodImages = await productImageModel.findAll()

	const listFilter = allProduct.sort((a, b) => b.prod_offer_number - a.prod_offer_number)

	const result = listFilter.map((element) => {
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
	}).slice(0, 5)

	return res.status(200).json({
		listBiggestOffer: result,
		statusCode: successCode
	})
})

router.get('/list-biggest-price', async (req, res) => {
	const allProduct = await productModel.findAll()
	const prodImages = await productImageModel.findAll()

	const listFilter = allProduct.sort((a, b) => b.prod_begin_price - a.prod_begin_price)

	const result = listFilter.map((element) => {
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

router.post('/detail', productValidation.details, async (req, res) => {
	const { prodId } = req.body

	const productInfo = await productModel.findById(prodId)
	const productImageList = await productImageModel.findByProdId(prodId)
	const productDescriptionList = await productDescriptionModel.findByProdId(prodId)

	if (productInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: 1
		})
	}
	
	const result = productInfo.map((element) => {
		return {
			prodId: element.prod_id,
			prodName: element.prod_name,
			prodCateId: element.prod_cate_id,
			prodOfferNumber: element.prod_offer_number,
			prodBeginPrice: element.prod_begin_price,
			prodStepPrice: element.prod_step_price,
			prodBuyPrice: element.prod_buy_price,
			prodImages: productImageList,
			prodDescription: productDescriptionList,
			createDate: moment(element.prod_created_date).format('YYYY-MM-DD HH:mm:ss'),
			expireDate: moment(element.prod_expired_date).format('YYYY-MM-DD HH:mm:ss')
		}
	})

	return res.status(200).json({
		productDetail: result,
		statusCode: errorCode
	})
})

router.post('/search', productValidation.productSearching, async (req, res) => {
	const { text, orderMode } = req.body
	const { limit, page } = req.query

	const convertText = text.split(' ');

	let searchCondition = ``
	convertText.forEach((item, index) => {
		if ((index + 1) !== convertText.length) {
			searchCondition += item + ' & '
		} else {
			searchCondition += item
		}
	})
	
	const prodImages = await productImageModel.findAll()
	const allProducts = await productModel.findAll()
	const allCategories = await categoriesModel.findAll()

	let prodListInfo = await knex('tbl_product')
							.whereRaw(`ts @@ to_tsquery('english', '${searchCondition}')`)

	if (orderMode === 0) {
		prodListInfo.sort((a, b) => b.prod_expired_date - a.prod_expired_date)
	} else {
		prodListInfo.sort((a, b) => a.prod_buy_price - b.prod_buy_price)
	}

	if (prodListInfo.length > 0) {
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
	
		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result.length / parseInt(limit))

			if (result.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listProducts: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			listProducts: result,
			statusCode: successCode
		})
	} else {
		let cateListInfo = await knex('tbl_categories')
								.whereRaw(`ts @@ to_tsquery('english', '${searchCondition}')`)
	
		if (cateListInfo.length > 0) {
			const result = await Promise.all(
				cateListInfo.map((element) => {
				if (element.cate_father !== null) {
					let resultProduct = []
					const listProduct = allProducts.filter((prodInfo) => element.cate_id === prodInfo.prod_cate_id)

					listProduct.forEach((prodInfo) => {
						resultProduct.push(prodInfo)
					})

					return resultProduct
				} else {
					const listSubCategories = allCategories.filter((cateInfo) => cateInfo.cate_father === cateListInfo[0].cate_id)

					let listProducts = []
					listSubCategories.forEach((item) => {
						const prodItem = allProducts.filter((prodInfo) => item.cate_id === prodInfo.prod_cate_id)

						prodItem.forEach((prodInfo) => {
							listProducts.push(prodInfo)
						})
					})

					return listProducts
				}
			}))

			const convertProduct = result[0].map((element) => {
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

			if (orderMode === 0) {
				convertProduct.sort((a, b) => b.prod_expired_date - a.prod_expired_date)
			} else {
				convertProduct.sort((a, b) => a.prod_buy_price - b.prod_buy_price)
			}
		
			if (page && limit) {
				let startIndex = (parseInt(page) - 1) * parseInt(limit)
				let endIndex = (parseInt(page) * parseInt(limit))
				let totalPage = Math.floor(convertProduct.length / parseInt(limit))
	
				if (convertProduct.length % parseInt(limit) !== 0) {
					totalPage = totalPage + 1
				}
		
				const paginationResult = convertProduct.slice(startIndex, endIndex)
		
				return res.status(200).json({
					totalPage,
					listProducts: paginationResult,
					statusCode: successCode
				})
			}
	
			return res.status(200).json({
				listProducts: convertProduct,
				statusCode: successCode
			})
		}
	}
	
	return res.status(200).json({
		listProducts: [],
		statusCode: successCode
	})
})

module.exports = router
