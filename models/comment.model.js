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

const findByToId = async (accId) => {
	const info = await knex('tbl_comment')
			.where({ cmt_to_id: accId })

	return info
}
const findByFromId = async (accId) => {
	const info = await knex('tbl_comment')
			.where({ cmt_from_id: accId })

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
	findByToId,
	findAll,
	findByFromId,
	create,
	update,
	del
}
