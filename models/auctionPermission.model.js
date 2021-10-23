const knex = require('../utils/dbConnection')

const findById = async (perId) => {
    const info = await knex('tbl_permission')
                    .where({ per_id: perId })

    return info
}

const findAll = async () => {
    const info = await knex('tbl_permission')

    return info
}

const findByBidderId = async (bidderId) => {
    const info = await knex('tbl_permission')
                    .where({ per_bidder_id: bidderId })

    return info
}

const findByBidderAndProduct = async (bidderId, prodId) => {
    const info = await knex('tbl_permission')
                    .where({ per_bidder_id: bidderId, per_prod_id: prodId })

    return info
}

const findByProdId = async (prodId) => {
    const info = await knex('tbl_permission')
                    .where({ per_prod_id: prodId })

    return info
}

const create = async (permissionInfo) => {
    await knex('tbl_permission')
        .insert(permissionInfo)

}

const update = async (perId, permissionInfo) => {
    await knex('tbl_permission')
        .where({ per_id: perId })
        .update(permissionInfo)
}

const updateWithBidderAndProd = async (bidderId, prodId, permissionInfo) => {
    await knex('tbl_permission')
        .where({ per_bidder_id: bidderId, per_prod_id: prodId })
        .update(permissionInfo)
}

const updateWithProdId = async (prodId, permissionInfo) => {
    await knex('tbl_permission')
        .where({ per_prod_id: prodId })
        .update(permissionInfo)
}

const del = async (perId) => {
    await knex('tbl_permission')
        .where({ per_id: perId })
        .del()
}

module.exports = {
    findById,
    findByBidderId,
    findByProdId,
    findAll,
    create,
    update,
    del,
	findByBidderAndProduct,
	updateWithBidderAndProd,
    updateWithProdId
}
