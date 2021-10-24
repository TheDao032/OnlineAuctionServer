const knex = require('../utils/dbConnection')

const findById = async (roleId) => {
	return await knex('tbl_roles')
					.where({ rol_id: roleId })
}

const checkAdminRole = async (roleId) => {
	if (roleId === 'ADM') {
		return true
	}
	return false
}

const checkSellerRole = async (roleId) => {
	if (roleId === 'SEL') {
		return true
	}
	return false
}

const checkBidderRole = async (roleId) => {
	if (roleId === 'BID') {
		return true
	}
	return false
}

module.exports = {
	findById,
	checkAdminRole,
	checkSellerRole,
	checkBidderRole
}
