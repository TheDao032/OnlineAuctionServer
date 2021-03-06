const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment')

const productModel = require('../models/product.model')
const accountModel = require('../models/account.model')
const commentModel = require('../models/comment.model')


const commentValidation = require('../middlewares/validation/comment.validate')

const successCode = 0
const errorCode = 1

router.post('/new-comment', commentValidation.newComment, async (req, res) => {
    const { toId, cmtContent, cmtVote, prodId } = req.body
    const { accId } = req.account

    const checkBidderExist = await accountModel.findById(toId)

    if (checkBidderExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Bidder Id`,
            statusCode: errorCode
        })
    }

    const checkProductExist = await productModel.findById(prodId)

    if (checkProductExist.length === 0) {
        return res.status(400).json({
            errorMessage: `Invalid Product Id`,
            statusCode: errorCode
        })
    }
    
    const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

    const commentInfo = {
        cmt_to_id: toId,
        cmt_from_id: accId,
        cmt_vote: cmtVote,
        cmt_content: cmtContent,
        cmt_created_date: presentDate,
        cmt_updated_date: presentDate
    }

    await commentModel.create(commentInfo)

    return res.status(200).json({
        statusCode: successCode
    })
})

// router.post('/bad-comment', commentValidation.badComment, async (req, res) => {
//     const { toId, prodId, fromId } = req.body

//     const checkBidderExist = await accountModel.findById(toId)

//     if (checkBidderExist.length === 0) {
//         return res.status(400).json({
//             errorMessage: `Invalid Bidder Id`,
//             statusCode: errorCode
//         })
//     }

//     const checkSellerExist = await accountModel.findById(fromId)

//     if (checkSellerExist.length === 0) {
//         return res.status(400).json({
//             errorMessage: `Invalid Bidder Id`,
//             statusCode: errorCode
//         })
//     }

//     const checkProductExist = await productModel.findById(prodId)

//     if (checkProductExist.length === 0) {
//         return res.status(400).json({
//             errorMessage: `Invalid Product Id`,
//             statusCode: errorCode
//         })
//     }
    
//     const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

//     const commentInfo = {
//         cmt_to_id: toId,
//         cmt_from_id: fromId,
//         cmt_vote: -1,
// 		cmt_content: 'Kh??ch H??ng Kh??ng Thanh To??n',
//         cmt_created_date: presentDate,
//         cmt_updated_date: presentDate
//     }

//     await commentModel.create(commentInfo)
    
//     return res.status(200).json({
//         statusCode: successCode
//     })
// })

router.get('/my-comment', commentValidation.queryInfo, async (req, res) => {
    const { page, limit } = req.query
    const { accId } = req.account

    const commentInfo = await commentModel.findByFromId(accId)

    if (commentInfo.length === 0) {
        return res.status(200).json({
            listComments: [],
            statusCode: successCode
        })
    }

    const convertComment = commentInfo.map((element) => {
        return {
            cmtId: element.cmt_id,
            cmtVote: element.cmt_vote,
            cmtContent: element.cmt_content,
            cmtFromId: element.cmt_from_id,
            cmtToId: element.cmt_to_id,
            createDate: moment(element.cmt_created_date).format('YYYY-MM-DD HH:mm:ss'),
            updateDate: moment(element.cmt_updated_date).format('YYYY-MM-DD HH:mm:ss')
        }
    })

    if (convertComment) {
		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(convertComment.length / parseInt(limit))

			if (convertComment.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = convertComment.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listComments: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listComments: convertComment,
			statusCode: successCode
		})
	}

    return res.status(200).json({
        listComments: [],
        statusCode: successCode
    })
})

router.get('/other-comment', async (req, res) => {
    const { page , limit } = req.query
    const { accId } = req.account

    const commentInfo = await commentModel.findByToId(accId)

    if (commentInfo.length === 0) {
        return res.status(200).json({
            listComments: [],
            statusCode: successCode
        })
    }

    const convertComment = commentInfo.map((element) => {
        return {
            cmtId: element.cmt_id,
            cmtVote: element.cmt_vote,
            cmtContent: element.cmt_content,
            cmtFromId: element.cmt_from_id,
            cmtToId: element.cmt_to_id,
            createDate: moment(element.cmt_created_date).format('YYYY-MM-DD HH:mm:ss'),
            updateDate: moment(element.cmt_updated_date).format('YYYY-MM-DD HH:mm:ss')
        }
    })

    if (convertComment) {
		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(convertComment.length / parseInt(limit))

			if (convertComment.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = convertComment.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listComments: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listComments: convertComment,
			statusCode: successCode
		})
	}

    return res.status(200).json({
        listComments: [],
        statusCode: successCode
    })
})

router.post('/list-comment', commentValidation.listCommentWithAccId, async (req, res) => {
    const { page, limit } = req.query
    const { accId } = req.body

    const commentInfo = await commentModel.findByToId(accId)

    if (commentInfo.length === 0) {
        return res.status(200).json({
            listComments: [],
            statusCode: successCode
        })
    }

    const convertComment = commentInfo.map((element) => {
        return {
            cmtId: element.cmt_id,
            cmtVote: element.cmt_vote,
            cmtContent: element.cmt_content,
            cmtFromId: element.cmt_from_id,
            cmtToId: element.cmt_to_id,
            createDate: moment(element.cmt_created_date).format('YYYY-MM-DD HH:mm:ss'),
            updateDate: moment(element.cmt_updated_date).format('YYYY-MM-DD HH:mm:ss')
        }
    })

    if (convertComment) {
		if (page && limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(convertComment.length / parseInt(limit))

			if (convertComment.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = convertComment.slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listComments: paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			listComments: convertComment,
			statusCode: successCode
		})
	}

    return res.status(200).json({
        listComments: [],
        statusCode: successCode
    })
})

module.exports = router
