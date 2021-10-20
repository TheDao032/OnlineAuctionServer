const knex = require('../utils/dbConnection')

const findById = async (cmtId) => {
	const info = await knex('tbl_comment')
			.where({ cmt_id: cmtId })

	return info
}

const findAll = async () => {
	const info = await knex('tbl_comment')

	return info
}

const findByBidderId = async (bidderId) => {
	const info = await knex('tbl_comment')
			.where({ cmt_bidder_id: bidderId })

	return info
}
const findBySellerId = async (sellerId) => {
	const info = await knex('tbl_comment')
			.where({ cmt_seller_id: sellerId })

	return info
}

const create = async (commentInfo) => {
	const returning = await knex('tbl_comment')
			.insert(commentInfo)
			.returning('cmt_id')

	return returning
}

const update = async (commentInfo, cmtId) => {
	await knex('tbl_comment')
			.update(commentInfo)
			.where({ cmt_id: cmtId })
}

const del = async (cmtId) => {
	await knex('tbl_comment')
			.where({ cmt_id: cmtId })
			.del()
}

module.exports = {
	findById,
	findByBidderId,
	findAll,
	findBySellerId,
	create,
	update,
	del
}
