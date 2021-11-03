const knex = require('../utils/dbConnection')

const findById = async (aucId) => {
    const info = await knex('tbl_auction')
                    .where({ auc_id: aucId })

    return info
}

const findAll = async () => {
    const info = await knex('tbl_auction')

    return info
}

const findByBidderId = async (bidderId) => {
    const info = await knex('tbl_auction')
                    .where({ auc_bidder_id: bidderId })

    return info
}

const findByBidderAndProduct = async (bidderId, prodId) => {
    const info = await knex('tbl_auction')
                    .where({ auc_bidder_id: bidderId, auc_prod_id: prodId })

    return info
}

const findBySellerId = async (sellerId) => {
    const info = await knex('tbl_auction')
                    .where({ auc_seller_id: sellerId })

    return info
}

const findByProdId = async (prodId) => {
    const info = await knex('tbl_auction')
                    .where({ auc_prod_id: prodId })

    return info
}

const findAttendAuction = async (bidderId) => {
   const info = knex('tbl_auction')
                    .distinct('auc_bidder_id', 'auc_prod_id')
                    .where({ auc_bidder_id: bidderId })
    return info
}

const create = async (aucInfo) => {
    await knex('tbl_auction')
        .insert(aucInfo)

}

const update = async (aucId, aucInfo) => {
    await knex('tbl_auction')
        .where({ auc_id: aucId })
        .update(aucInfo)
}

const updateWithBidderAndProd = async (bidderId, prodId, aucInfo) => {
    await knex('tbl_auction')
        .where({ auc_bidder_id: bidderId, auc_prod_id: prodId })
        .update(aucInfo)
}

const del = async (aucId) => {
    await knex('tbl_auction')
        .where({ auc_id: aucId })
        .del()
}

module.exports = {
    findById,
    findByBidderId,
    findBySellerId,
    findByProdId,
    findAll,
    create,
    update,
    del,
	findByBidderAndProduct,
	updateWithBidderAndProd,
    findAttendAuction
}
