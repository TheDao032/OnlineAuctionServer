const express = require('express')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')

const errorCode = 1
const successCode = 0

router.post('/add-father', categoriesValidation.newCategoryFather, async (req, res) => {
	const { cateName } = req.body

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((item) => item.cate_name.toLowerCase() === cateName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

	const presentDate = moment().format("YYYY-MM-DD HH:mm:ss")
	const newFatherCate = {
		cate_name: cateName,
		cate_created_date: presentDate,
		cate_updated_date: presentDate
	}

	await categoriesModel.create(newFatherCate)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-child', categoriesValidation.newCategoryChild, async (req, res) => {
	const { cateName, cateFather } = req.body

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((item) => item.cate_name.toLowerCase() === cateName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

	const fatherInfo = await categoriesModel.findById(cateFather)

	if (fatherInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Category Father Id`,
			statusCode: errorCode
		})
	}

	if (fatherInfo[0].cate_father !== null) {
		return res.status(400).json({
			errorMessage: `Can't Set Sub-Category To Be Category Father`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format("YYYY-MM-DD HH:mm:ss")
	const cateInfo = {
		cate_name: cateName,
		cate_father: cateFather,
		cate_created_date: presentDate,
		cate_updated_date: presentDate
	}

	await categoriesModel.create(cateInfo)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update', categoriesValidation.updateCategory, async (req, res) => {
	const { cateId, cateName, cateFather } = req.body

	const result = await categoriesModel.findById(cateId)

	const allCategories = await categoriesModel.findAll()

	if (cateName && cateName !== '') {
		const checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === cateName.toLowerCase()) && (info.cate_id !== cateId))

		if (checkExist) {
			return res.status(400).json({
				errorMessage: 'Category Name Has Already Existed',
				statusCode: errorCode
			})
		}
	}

	
	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Category Id',
			statusCode: errorCode
		})
	}

	const checkCateFather = cateFather && cateFather !== ''

	if (checkCateFather) {
		const fatherInfo = await categoriesModel.findById(cateFather)

		if (fatherInfo.length === 0) {
			return res.status(400).json({
				errorMessage: 'Category Father Id Is Not Found',
				statusCode: errorCode
			})
		}

		if (fatherInfo[0].cate_father !== null) {
			return res.status(400).json({
				errorMessage: `Can't Set Sub-Category To Be Category Father`,
				statusCode: errorCode
			})
		}
	}

	const presentDate = moment().format("YYYY-MM-DD HH:mm:ss")
	const cateInfo = {
		cate_name: cateName,
		cate_father: checkCateFather ? cateFather : result[0].cate_father,
		cate_updated_date: presentDate
	}

	await categoriesModel.update(cateId, cateInfo)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete', categoriesValidation.deleteCategory, async (req, res) => {
	const { cateId } = req.body

	const result = await categoriesModel.findById(cateId)

	if (result.length === 0) {
		res.status(400).json({
			errorMessage: 'Invalid Catetegory Id',
			statusCode: errorCode
		})
	}

	const listChildByCateId = await categoriesModel.findChild(cateId)

	if (listChildByCateId.length !== 0) {
		return res.status(400).json({
			errorMessage: 'Category Still Has Sub Cateogory',
			statusCode: errorCode
		})
	}

	const productsByCate = await productModel.findByCateId(cateId)

	if (productsByCate.length !== 0) {
		return res.status(400).json({
			errorMessage: 'Category Still Has Products',
			statusCode: errorCode
		})
	}

	await categoriesModel.del(cateId)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router