const knex = require('../utils/dbConnection')

const create = async (prodDescriptionInfo) => {
    await knex('tbl_product_description').insert(prodDescriptionInfo)
}

const findById = async (prodDescriptionId) => {
	const info = await knex('tbl_product_description').where({ prod_desc_id: prodDescriptionId })

	return info
}

const findByProdId = async (prodId) => {
	const info = await knex('tbl_product_description').where({ prod_desc_prod_id: prodId })

	return info
}

const findAll = async () => {
	const info = await knex('tbl_product_description')

	return info
}

const del = async (prodId) => {
	await knex('tbl_product_description').del()
	.where({ prod_desc_prod_id: prodId })

}

module.exports = {
    create,
    findById,
    findByProdId,
    findAll,
	del
}