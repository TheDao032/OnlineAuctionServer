const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const imageService = require('../services/imageService')
const imageproductValidation = require('../middlewares/validation/image.validate')
const commonService = require('../services/commonService')
const productValidation = require('../middlewares/validation/product.validate')
const productModel = require('../models/product.model')

const successCode = 0
const errorCode = 1

router.post('/list', productValidation.paramsInfo, async (req, res) => {
	const { page, limit } = req.query

	const allCategories = await categoriesModel.findAll()
	const listCategoriesFather = await categoriesModel.findFather()
	const listCategoriesFatherWithoutChild = await categoriesModel.findAllFather()

	const filterList = listCategoriesFatherWithoutChild.filter((info) => {
		const checkExist = listCategoriesFather.find((item) => item.cate_father === info.cate_id)
		if (checkExist) {
			return false
		}

		return true
	})

	
	const result = await Promise.all([
		listCategoriesFather.map((item) => {
			const fatherInfo = allCategories.find((info) => info.cate_id === item.cate_father)
			const listChild = allCategories.filter((info) => info.cate_father === item.cate_father)
			
			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				subCategories: listChild.map((itemChild) => {
					const createDate = moment(new Date(itemChild.cate_created_date)).format("DD-MM-YYYY")					

					return {
						cateId: itemChild.cate_id,
						cateName: itemChild.cate_name,
						createDate
					}
				})
			}
		}),
		filterList.map((item) => {
			const fatherInfo = allCategories.find((info) => info.cate_id === item.cate_id)
			const listChild = allCategories.filter((info) => info.cate_father === item.cate_id)
			
			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				subCategories: listChild.map((itemChild) => {
					const createDate = moment(new Date(itemChild.cate_created_date)).format("DD-MM-YYYY")

					return {
						cateId: itemChild.cate_id,
						cateName: itemChild.cate_name,
						createDate
					}
				})
			}
		})
	])
	
	if (result) {
		result[1].forEach((item) => {
			result[0].push(item)
		})

		result[0].sort((a, b) => a - b)

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			paginationResult: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		paginationResult: {},
		statusCode: errorCode
	})
	// const offset = limit * (page - 1)


	// if (page < 1 || limit < 1 || limit > 10) {
	// 	return res.status(400).json({
	// 		errorMessage: "limit and page parameter is not valid",
	// 		statusCode: errorCode
	// 	})
	// }

	// var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	// from tbl_product`)


	// numberPage = Number(numberPage.rows[0].count)
	// if (numberPage > limit) {
	// 	numberPage = Math.ceil(numberPage / limit)
	// }
	// else {
	// 	numberPage = 1
	// }

	// var result = await knex.raw(`with product as(
	// 	select * from tbl_product join tbl_categories on tbl_categories.cate_id = tbl_product.prod_category_id
	// 	order by prod_id desc
	// 	offset ${offset}
	// 	limit ${limit}
	// )
	// select pr.*, img.prod_img_data from product pr left join tbl_product_images img
	// on img.prod_img_product_id = pr.prod_id
	// order by prod_id desc`)
	// result = result.rows


	// var prodList = []

	// var index = 0
	// while (index < result.length) {
	// 	let prodObj = {
	// 		prod_id: result[index].prod_id,
	// 		prod_name: result[index].prod_name,
	// 		prod_category_id: result[index].prod_category_id,
	// 		prod_category_name: result[index].cate_name,
	// 		prod_amount: result[index].prod_amount,
	// 		prod_description: result[index].prod_description,
	// 		prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
	// 		prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
	// 		prod_price: result[index].prod_price
	// 	}

	// 	let imageLink = []
	// 	for (let i = index; i < result.length; i++) {
	// 		index = i + 1
	// 		imageLink.push(result[i].prod_img_data)

	// 		if ((i >= result.length - 1) || (result[index].prod_id != result[index - 1].prod_id)) {
	// 			break;
	// 		}
	// 	}
	// 	prodObj['images'] = imageLink
	// 	prodList.push(prodObj)
	// }

	// if (result) {
	// 	return res.status(200).json({
	// 		numberOfPage: numberPage,
	// 		listProduct: prodList,
	// 		statusCode: successCode
	// 	})
	// }
})

router.post('/list-best-sale', productValidation.listBestSale, async (req, res) => {
	const { limit, page } = req.body

	const offset = limit * (page - 1)

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var result = await knex.raw(`with productSale as(
		select sum(bde.bdetail_quantity) as quantity,pro.* from (tbl_product pro 
		join tbl_bill_detail bde on pro.prod_id = bde.bdetail_product_id)
		group by pro.prod_id
		order by quantity desc
		limit ${limit}
		offset ${offset}
	)
	select distinct pr.*,img.prod_img_data from productSale pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id order by pr.quantity desc`)

	result = result.rows

	var numberPage = await knex.raw('select count(DISTINCT bdetail_product_id) from tbl_bill_detail')

	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
			prod_price: result[index].prod_price,
			quantity: result[index].quantity
		}
		let imageLink = result[index].prod_img_data

		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}

	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.post('/list-suggestion', productValidation.listSuggestion, async (req, res) => {
	const { limit, page, catID } = req.body
	const offset = limit * (page - 1)


	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	from tbl_product join tbl_comment on tbl_product.prod_id = tbl_comment.cmt_product_id
	where tbl_product.prod_category_id = ${catID}`)


	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}


	var result = await knex.raw(`with product as(
		select tbl_product.*, round(avg(tbl_comment.cmt_vote),2) as avgStar
		from tbl_product join tbl_comment on tbl_product.prod_id = tbl_comment.cmt_product_id
		where tbl_product.prod_category_id = ${catID}
		group by tbl_product.prod_id
		offset ${offset}
		limit ${limit}
	)
	select pr.*,img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id order by avgStar desc`)

	result = result.rows


	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
			prod_price: result[index].prod_price,
			avgStar: result[index].avgstar
		}
		let imageLink = result[index].prod_img_data
		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}


	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.post('/list-by-cat', productValidation.listByCategory, async (req, res) => {
	const { limit, page, catID } = req.body
	const offset = limit * (page - 1)
	var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	from tbl_product 
	where tbl_product.prod_category_id = ${catID}`)
	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	//cat not exists
	var result = await knex.raw(`with product as(
		select * from tbl_product
		where tbl_product.prod_category_id = ${catID}
		order by prod_created_date desc
		offset ${offset}
		limit ${limit}
	)
	select pr.*,img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id`)

	result = result.rows
	
	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
			prod_price: result[index].prod_price,
		}
		let imageLink = result[index].prod_img_data

		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}

	var numberOfProduct = await knex.raw(`select count(prod_id) from tbl_categories join tbl_product on tbl_product.prod_category_id = tbl_categories.cate_id where tbl_categories.cate_id = ${catID}`)


	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			numberProduct: numberOfProduct.rows[0].count,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.get('/details/:id', async (req, res) => {
	const { id } = req.params

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
	const { prodName, limit, page } = req.body
	var offset = limit * (page - 1)
	
	var numberPage = await knex.raw(`SELECT count(prod_id)
	FROM tbl_product
	WHERE ts @@ to_tsquery('english', '${prodName}')`)

	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	//FULL TEXT SEARCH
	var result = await knex.raw(`with product as (
		SELECT *
		FROM tbl_product
		WHERE ts @@ to_tsquery('english', '${prodName}')
		order by prod_created_date desc
		limit ${limit}
		offset ${offset}
	)
	select pr.*,img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id`)
	result = result.rows


	var prodList = []
	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
			prod_price: result[index].prod_price,
		}
		let imageLink = result[index].prod_img_data
		
		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		
		index += 1
	}
	
	var numberOfProduct = await knex.raw(`SELECT count(prod_id) FROM tbl_product WHERE ts @@ to_tsquery('english', '${prodName}')`)

	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			numberProduct: numberOfProduct.rows[0].count,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}
})

module.exports = router
