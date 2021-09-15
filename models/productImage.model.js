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

const findAll = async () => {
	const info = await knex('tbl_product_images')

	return info
}

module.exports = {
    create,
    findById,
    findByProdId,
    findAll
}