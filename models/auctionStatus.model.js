const knex = require('../utils/dbConnection')

const findById = async (sttId) => {
    const info = await knex('tbl_auction_status')
                    .where({ stt_id: sttId })

    return info
}

const findAll = async () => {
    const info = await knex('tbl_auction_status')

    return info
}

const findByBidderId = async (bidderId) => {
    const info = await knex('tbl_auction_status')
                    .where({ stt_bidder_id: bidderId })

    return info
}

const findByBidderAndProduct = async (bidderId, prodId) => {
    const info = await knex('tbl_auction_status')
                    .where({ stt_bidder_id: bidderId, stt_prod_id: prodId })

    return info
}

const findByProdId = async (prodId) => {
    const info = await knex('tbl_auction_status')
                    .where({ stt_prod_id: prodId })

    return info
}

const create = async (aucStatusInfo) => {
    await knex('tbl_auction_status')
        .insert(aucStatusInfo)

}

const update = async (sttId, aucStatusInfo) => {
    await knex('tbl_auction_status')
        .where({ stt_id: sttId })
        .update(aucStatusInfo)
}

const updateWithBidderAndProd = async (bidderId, prodId, aucStatusInfo) => {
    await knex('tbl_auction_status')
        .where({ stt_bidder_id: bidderId, stt_prod_id: prodId })
        .update(aucStatusInfo)
}

const updateWithProdId = async (prodId, aucStatusInfo) => {
    await knex('tbl_auction_status')
        .where({ stt_prod_id: prodId })
        .update(aucStatusInfo)
}

const del = async (sttId) => {
    await knex('tbl_auction_status')
        .where({ stt_id: sttId })
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
