const knex = require('../utils/dbConnection')

const findByAccAndProduct = async (accId, prodId) => {
	const info = await knex('tbl_watch')
					.where({ watch_acc_id: accId, watch_prod_id: prodId })

    return info
}

const findByAcc = async (accId) => {
	const info = await knex('tbl_watch')
					.where({ watch_acc_id: accId })

    return info
}

const findById = async (watchId) => {
	const info = await knex('tbl_watch')
					.where({ watch_id: watchId })

    return info
}

const updateWatch = async (watchId, watchInfo) => {
	const returnInfo = await knex('tbl_watch')
			.update(watchInfo)
			.where({ watch_id: watchId }).returning('watch_id')

	return returnInfo[0]
}


const addWatch = async (watchInfo) => {
	const returnInfo = await knex('tbl_watch')
			.insert(watchInfo).returning('watch_id')

	return returnInfo[0]
}

module.exports = {
	findByAccAndProduct,
	findByAcc,
	updateWatch,
	addWatch,
	findById
}
