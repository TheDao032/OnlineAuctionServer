const knex = require('../utils/dbConnection')

const findById = async (cateId) => {
    const info = await knex('tbl_categories')
                    .where({ cate_id: cateId })

    return info
}

const findAll = async () => {
    const info = await knex('tbl_categories')

    return info
}

const findFather = async () => {
    const info = await knex('tbl_categories')
                    .where({ cate_father: null })

    return info
}

const findChild = async (cateFather) => {
    const info = await knex('tbl_categories')
                    .where({ cate_father: cateFather })

    return info
}

const create = async (cateInfo) => {
    await knex('tbl_categories')
        .insert(cateInfo)

}

const update = async (cateId, cateInfo) => {
    await knex('tbl_categories')
        .where({ cate_id: cateId })
        .update(cateInfo)
}

const del = async (cateId) => {
    await knex('tbl_categories')
        .where({ cate_id: cateId })
        .del()
}

module.exports = {
    findById,
    findFather,
    findChild,
    findAll,
    create,
    update,
    del
}