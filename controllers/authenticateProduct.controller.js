const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');

const imageproductValidation = require('../middlewares/validation/image.validate')

const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')
const productImagesModel = require('../models/productImage.model')
const productDescriptionModel = require('../models/productDescription.model')

const productValidation = require('../middlewares/validation/product.validate')

const successCode = 0
const errorCode = 1

router.post('/add', productValidation.newProduct, async (req, res) => {

	const { prodName, prodCateId, prodBeginPrice, prodStepPrice, prodBuyPrice, prodDescription } = req.body
	const prodImage = req.files

	let checkProdImage = false
	if (prodImage) {
		checkProdImage = prodImage.image ? true : false
	}

	const convertStep = parseFloat(prodStepPrice)

	if (convertStep < 0 ) {
		return res.status(400).json({
			errorMessage: `Product Step Price Can't Smaller Than 0`,
			statusCode: errorCode
		})
	}

	if (prodBuyPrice) {
		const convertBuy = parseFloat(prodBuyPrice)
		if (convertBuy < 1) {
			return res.status(400).json({
				errorMessage: `Product Buy Price Can't Smaller Than 1`,
				statusCode: errorCode
			})
		}
	}
	
	const listProdInfo = await productModel.findAll()

	const checkExistProd = listProdInfo.find((item) => (item.prod_name.toLowerCase() === prodName.toLowerCase()) && (item.prod_cate_id === parseInt(prodCateId)))

	if (checkExistProd) {
		return res.status(400).json({
			errorMessage: `Product's Name Has Already Existed`,
			statusCode: errorCode
		})
	}

	const cateInfo = await categoriesModel.findById(prodCateId)

	if (cateInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Category Is Invalid`,
			statusCode: errorCode
		})
	}

	if (cateInfo[0].cate_father === null) {
		return res.status(400).json({
			errorMessage: `Not Sub Categories`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const expireDate = moment(new Date(moment().year(), moment().month(), moment().date() + 1, moment().hour(), moment().minute(), moment().second())).format('YYYY-MM-DD HH:mm:ss')

	const convertBegin = parseFloat(prodBeginPrice)

	const newProd = {
		prod_name: prodName,
		prod_cate_id: prodCateId,
		prod_begin_price: prodBeginPrice && convertBegin > 0 ? convertBegin : 0,
		prod_step_price: convertStep,
		prod_buy_price: prodBuyPrice ? parseFloat(prodBuyPrice) : null,
		prod_created_date: presentDate,
		prod_expired_date: expireDate,
		prod_updated_date: presentDate
	}

	const returnInfo = await productModel.create(newProd)

	if (returnInfo.length === 0) {
		return res.status(500).json({
			errorMessage: `Internal Server Error`,
			statusCode: errorCode
		})
	}

	if (checkProdImage) {
		var checkValidImage = imageproductValidation.validateValidImage(prodImage.image)

		if (!checkValidImage) {
			return res.status(400).json({
				errorMessage: `Product's Images Type Is Invalid Or Product's Images Files Is Bigger Than 5`,
				statusCode: errorCode
			})
		}

		if (prodImage.image.length === undefined) {// number of uploaded image is 1
			const newProdImage = {
				prod_img_product_id: returnInfo[0],
				prod_img_data: prodImage.image
			}
	
			await productImagesModel.create(newProdImage)
		} else {
			for (let i = 0; i < prodImage.image.length; i++) {
				const newProdImage = {
					prod_img_product_id: returnInfo[0],
					prod_img_data: prodImage.image[i]
				}
		
				await productImagesModel.create(newProdImage)
			}
		}
	}

	const newProdDescription = {
		prod_desc_prod_id: returnInfo[0],
		prod_desc_content: prodDescription ? prodDescription : '',
		prod_desc_created_date: presentDate,
		prod_desc_updated_date: presentDate
	}

	await productDescriptionModel.create(newProdDescription)

	return res.status(200).json({
		statusCode: successCode
	})

})

router.post('/update', productValidation.updateProduct, async (req, res) => {
	const { prodId, prodName, prodCateId, prodBeginPrice, prodStepPrice, prodBuyPrice } = req.body

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	let updateProd = {}

	updateProd.prod_updated_date = presentDate

	const listProducts = await productModel.findAll()

	const checkExistProd = await productModel.findById(prodId)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	if (prodName && prodName !== '') {
		const checkExistProdName = listProducts.find((item) => (item.prod_name.toLowerCase() === prodName.toLowerCase()) && (item.prod_id !== prodId))

		if (checkExistProdName) {
			return res.status(400).json({
				errorMessage: `Product's Name Already Exist`,
				statusCode: errorCode
			})
		}

		updateProd.prod_name = prodName
	} else {
		updateProd.prod_name = checkExistProd[0].prod_name
	}

	if (prodBeginPrice) {
		if (parseFLoat(prodBeginPrice) < 0) {
			return res.status(400).json({
				errorMessage: `Product Begin Price Can't Smaller Than 0`,
				statusCode: errorCode
			})
		}
		updateProd.prod_begin_price = prodBeginPrice
	} else {
		updateProd.prod_begin_price = checkExistProd[0].prod_begin_price
	}

	if (prodStepPrice) {
		if (parseFLoat(prodStepPrice) < 1) {
			return res.status(400).json({
				errorMessage: `Product Step Price Can't Smaller Than 1`,
				statusCode: errorCode
			})
		}
		updateProd.prod_step_price = prodStepPrice
	} else {
		updateProd.prod_step_price = checkExistProd[0].prod_step_price
	}

	if (prodBuyPrice) {
		if (parseFLoat(prodBuyPrice) < 1) {
			return res.status(400).json({
				errorMessage: `Product Buy Price Can't Smaller Than 1`,
				statusCode: errorCode
			})
		}
		updateProd.prod_buy_price = prodBuyPrice
	} else {
		updateProd.prod_buy_price = checkExistProd[0].prod_buy_price
	}

	if (prodCateId) {
		const cateInfo = await categoriesModel.findById(prodCateId)

		if (cateInfo.length === 0) {
			return res.status(400).json({
				errorMessage: `Categogt Doesn't Exist`,
				statusCode: errorCode
			})
		}

		updateProd.prod_cate_id = prodCateId
	} else {
		updateProd.prod_cate_id = checkExistProd[0].prod_cate_id
	}

	if (prodDescription && prodDescription !== '') {
		const updateProdDescription = {
			prod_desc_prod_id: prodId,
			prod_desc_content: prodDescription,
			prod_desc_created_date: presentDate,
			prod_desc_updated_date: presentDate
		}

		await productDescriptionModel.create(updateProdDescription)
	}

	
	await productModel.update(updateProd, prodId)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-image', productValidation.updateImage, async (req, res) => {
	const { prodId, prodImageId } = req.body
	const prodImage = req.files

	let checkProdImage = false
	if (prodImage) {
		checkProdImage = prodImage.image ? true : false
	}

	if (!checkProdImage) {
		return res.status(400).json({
			errorMessage: `Image Is Required`,
			statusCode: errorCode
		})
	}

	if (prodImage.image.length !== undefined) {
		return res.status(400).json({
			errorMessage: `Too Many Images Are Selected. Please Select 1 Image`,
			statusCode: errorCode
		})
	}

	const checkExistProd = await productModel.findById(prodId)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const checkExistProdImage = await productImagesModel.findByIdAndProd(prodId, prodImageId)

	if (checkExistProdImage.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Image Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const checkValidImage = imageproductValidation.validateValidImage(prodImage.image)
	
	if (!checkValidImage) {
		return res.status(400).json({
			errorMessage: `Product's Image Isn't Right Type`,
			statusCode: errorCode
		})
	}

	const prodImageInfo = {
		prod_img_data: prodImage.image
	}

	await productImagesModel.update(prodImageId, prodImageInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('update-description', productValidation.updateDescription, async (req, res) => {
	const { prodId, prodDescription } = req.body

	const checkExist = await productModel.findById(prodId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const updateProdDescription = {
		prod_desc_prod_id: prodId,
		prod_desc_content: prodDescription,
		prod_desc_created_date: presentDate,
		prod_desc_updated_date: presentDate
	}

	await productDescriptionModel.create(updateProdDescription)
})

router.post('/delete', async (req, res) => {
	const { prodId } = req.body
	const checkExist = await productModel.findById(prodId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Product Id`,
			statusCode: errorCode
		})
	}

	await productImagesModel.del(prodId)

	await productDescriptionModel.del(prodId)

	await productModel.del(prodId)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router