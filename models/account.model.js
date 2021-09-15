const knex = require('../utils/dbConnection')

const accountStatus = {
	activatedStatus: 0,
	inActivatedStatus: 1,
	unAuthorizeStatus: 2
}

const findAll = async () => {
	const info =  await knex('tbl_account')

	return info
}

const findByEmail = async (email) => {
	const info = await knex('tbl_account')
					.where({ acc_email: email })
	return info
}

const findActiveUser = async (email) => {
	const info = await knex('tbl_account')
		.where({ acc_email: email })
		.whereNot({ acc_status: 1})
	return info
}

const findById = async (id) => {
	const info = await knex('tbl_account')
		.where({ acc_id: id })
	return info
}

const updateRefreshToken = async (accId, refreshToken) => {
	await knex('tbl_account')
		.where({ acc_id: accId })
		.update({ acc_refresh_token: refreshToken })
}

const isValidRefreshToken = async (accId, refreshToken) => {
	const checkRefreshToken = await knex('tbl_account')
									.where({ acc_id: accId, acc_refresh_token: refreshToken})

	if (checkRefreshToken.length === 0) {
		return false
	}
	
	return true
}

const updateAccount = async (accId, accountObject) => {
	await knex('tbl_account').where('acc_id', accId).update(accountObject)
}

module.exports = {
	findByEmail,
	findById,
	findAll,
	findActiveUser,
	updateRefreshToken,
	isValidRefreshToken,
	updateAccount,
	accountStatus
}
