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

	const { prodName, prodCateId, prodPrice, prodDescription } = req.body
	const prodImage = req.files

	let checkProdImage = false
	if (prodImage) {
		checkProdImage = prodIm
		age.image ? true : false
	}

	if (parseFLoat(prodPrice) < 0) {
		return res.status(400).json({
			errorMessage: `Product Price Can't Smaller Than 0`,
			statusCode: errorCode
		})
	}

	const listProdInfo = await productModel.findAll()

	const checkExistProd = listProdInfo.find((item) => (item.prod_name.toLowerCase() === prodName.toLowerCase()) && (item.prod_cate_id === prodCateId))

	if (checkExistProd) {
		return res.status(400).json({
			errorMessage: `Product Has Already Existed`,
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

	//validate image
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
				prod_img_product_id: returnInfo[0].prod_id,
				prod_img_data: prodImage.image
			}
	
			await productImagesModel.create(newProdImage)
		} else {
			for (let i = 0; i < images.length; i++) {
				const newProdImage = {
					prod_img_product_id: returnInfo[0].prod_id,
					prod_img_data: prodImage.image[i]
				}
		
				await productImagesModel.create(newProdImage)
			}
		}
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const newProd = {
		prod_name: prodName,
		prod_cate_id: prodCateId,
		prod_price: parseFloat(prodPrice),
		prod_created_date: presentDate,
		prod_updated_date: presentDate
	}

	const returnInfo = await productModel.create(newProd)

	if (returnInfo.length === 0) {
		return res.status(500).json({
			errorMessage: `Internal Server Error`,
			statusCode: errorCode
		})
	}

	const newProdDescription = {
		prod_desc_prod_id: returnInfo[0].prod_id,
		prod_desc_content: prodDescription ? prodDescription : '',
		prod_desc_created_date: presentDate,
		prod_desc_updated_date: presentDate
	}

	await productDescriptionModel.create(newProdDescription)

	return res.status(200).json({
		statusCode: successCode
	})

})

router.post('/update/:id', productValidation.updateProduct, async (req, res) => {
	const { prodName, prodCateId, prodPrice, prodDescription } = req.body
	const { id } = req.params

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	let updateProd = {}

	updateProd.prod_updated_date = presentDate

	const listProducts = await productModel.findAll()

	const checkExistProd = await productModel.findById(id)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	if (prodName && prodName !== '') {
		const checkExistProdName = listProducts.find((item) => (item.prod_name.toLowerCase() === prodName.toLowerCase()) && (item.prod_id !== id))

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

	if (prodPrice) {
		if (parseFloat(prodPrice) < 0) {
			return res.status(400).json({
				errorMessage: `Product's Price Can't Be Smaller Than 0`,
				statusCode: errorCode
			})
		}

		updateProd.prod_price = parseFloat(prodPrice)
	} else {
		updateProd.prod_price = checkExistProd0[0].prod_price
	}

	if (prodDescription && prodDescription !== '') {
		const updateProdDescription = {
			prod_desc_prod_id: id,
			prod_desc_content: prodDescription,
			prod_desc_created_date: presentDate,
			prod_desc_updated_date: presentDate
		}

		await productDescriptionModel.create(updateProdDescription)
	}

	
	await productModel.update(updateProd, id)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-image/:id', async (req, res) => {
	const { id } = req.params // product id
	const { imageId } = req.body
	const prodImages = req.files //get file from req.files.image

	if (prodImages.image.length !== undefined) {
		return res.status(400).json({
			errorMessage: `Can Only Update 1 Image`,
			statusCode: errorCode
		})
	}

	const checkExistProd = await productModel.findById(id)

	if (checkExistProd.length === 0) {
		return res.status(400).json({
			errorMessage: `Product Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const checkValidImage = imageproductValidation.validateValidImage(images)
	
	if (checkValidImage) {
		return res.status(400).json({
			errorMessage: `Product's Image Isn't Right Type `,
			statusCode: errorCode
		})
	}
	//validate length of old image & new image
	var numberOfNewImage = imageService.getImageLength(images)
	var imagesNameArray = imageName.split(",")
	var numberOfOldImage = imagesNameArray.length
	var prodImgNumber = await knex.raw(`select count(prod_img_product_id) from tbl_product_images where prod_img_product_id = ${id}`)
	prodImgNumber = prodImgNumber.rows[0].count


	if (5 - prodImgNumber + numberOfOldImage - numberOfNewImage <= 0) {
		return res.status(400).json({
			errorMessage: "Number of image to update and number of image to delete is not valid, note that one product can have only 5 images",
			statusCode: errorCode
		})
	}
	//delete old image
	if (numberOfOldImage > 0) {
		var imageLink = await knex.raw(`select prod_img_data from tbl_product_images where prod_img_product_id = ${id}`)
		imageLink = imageLink.rows
		//console.log(imageLink.rows[0].prod_img_data)
		for (let i = 0; i < numberOfOldImage; i++) {
			for (let j = 0; j < imageLink.length; j++) {
				if (imagesNameArray[i] == imageLink[j].prod_img_data) {
					await knex.raw(`delete from tbl_product_images where prod_img_data = '${imageLink[j].prod_img_data}'`)
					imageService.deleteImage(imageLink[j].prod_img_data);
				}
			}
		}
	}

	//add new image
	if (numberOfNewImage > 0) {
		images = imageService.getImage(images)

		if (images != null) {
			if (images.length === undefined) {// number of uploaded image is 1
				await imageService.productUploader(images, id, 'insert')
			}
			else {
				for (let i = 0; i < images.length; i++) {
					await imageService.productUploader(images[i], id, 'insert')
				}
			}
		}
	}

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id', async (req, res) => {
	const { id } = req.params
	var prod = await knex('tbl_product')
		.where('prod_id', id)

	if (prod.length === 0) {
		var errorMessage = " Product record doesn't exist!"

		return res.status(400).json({
			errorMessage: errorMessage,
			statusCode: 1
		})
	}
	//call function
	productModel.deleteProduct(id)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router