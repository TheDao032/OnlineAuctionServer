const knex = require('../utils/dbConnection')

const create = async (prodImageInfo) => {
    await knex('tbl_product_images').insert(prodImageInfo)
}

const findById = async (prodImageId) => {
	const info = await knex('tbl_product_images').where({ prod_img_id: prodImageId })

	return info
}

const findByProdId = async (prodId) => {
	const info = await knex('tbl_product_images').where({ prod_img_product_id: prodId })

	return info
}

const findByIdAndProd = async (prodId, prodImageId) => {
	const info = await knex('tbl_product_images')
		.where({ prod_img_product_id: prodId, prod_img_id: prodImageId })

	return info
}

const findAll = async () => {
	const info = await knex('tbl_product_images')

	return info
}

const update = async (prodImageId, prodImageInfo) => {
	await knex('tbl_product_images').update(prodImageInfo)
		.where({ prod_img_id: prodImageId })
}

const delByProdId = async (prodId) => {
	await knex('tbl_product_images').del()
		.where({ prod_img_product_id: prodId })
}

const delById = async (prodImgId) => {
	await knex('tbl_product_images').del()
		.where({ prod_img_id: prodImgId })
}

module.exports = {
    create,
    findById,
    findByProdId,
    findAll,
	update,
	findByIdAndProd,
	delByProdId,
	delById
}