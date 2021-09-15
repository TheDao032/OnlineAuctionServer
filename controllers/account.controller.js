const express = require('express') 

const router = express.Router()
const knex = require('../utils/dbConnection')
const accountValidation = require('../middlewares/validation/account.validate')
const bcrypt = require('bcrypt')

const accountModel = require('../models/account.model')
const roleModel = require('../models/role.model')
const deliveryModel = require('../models/delivery.model')
const imageService = require('../services/imageService')

const successCode = 0
const errorCode = 1

router.get('/list', accountValidation.listParamsInfo, async (req, res) => {
	const { page, limit } = req.query

	const allAccount = await accountModel.findAll()

	const result = await Promise.all([
		allAccount.map((element) => {
			return {
				accId: element.acc_id,
				accEmail: element.acc_email,
				accPhoneNumber: element.acc_phone_number,
				accFullName: element.acc_full_name,
				accAvatar: element.acc_avatar,
				accStatus: element.acc_status
			}
		})
	])

	if (result) {
		result.sort((a, b) => a - b)

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
				listAccouts: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			listAccouts: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listAccounts: [],
		statusCode: errorCode
	})
})

router.post('/details', accountValidation.detailInfo, async (req, res) => {
	const { accId } = req.body
	const { accRole } = req.account

	let accIdFlag = req.account.accId

	if (accId) {
		if (roleModel.checkAdminRole(accRole)) {
			accIdFlag = accId
		}
	}

	const accInfo = await accountModel.findById(accIdFlag)

	if (accInfo.length === 0) {
		return res.status(200).json({
			account: [],
			statusCode: errorCode
		})
	}

	const deliveryAddress = await deliveryModel.findDeliveryByAccId(accIdFlag)

	const responseResult = {
		accEmail: accInfo[0].acc_email,
		accFullName: accInfo[0].acc_full_name,
		accPhoneNumber: accInfo[0].acc_phone_number,
		accAvatar: accInfo[0].acc_avatar,
		deliveryAddress: deliveryAddress[0]
	}

	return res.status(200).json({
		account: responseResult,
		statusCode: successCode
	})
})

router.post('/update', accountValidation.updateAccount, async (req, res) => {	
	const { accId, accEmail, accPhoneNumber, accFullName } = req.body
	const { accRole } = req.account

	let accIdFlag = req.account.accId

	if (accId) {
		if (roleModel.checkAdminRole(accRole)) {
			accIdFlag = accId
		}
	}

	const allAccount = await accountModel.findAll()

	if (accEmail && accEmail !== '') {
		const checkExistEmail = allAccount.find((item) => (item.acc_id !== accIdFlag) && (item.acc_email === accEmail))

		if (checkExistEmail) {
			return res.status(400).json({
				errorMessage: 'Email Has Already Existed',
				statusCode: errorCode
			})
		}
	}

	const result = await accountModel.findById(accIdFlag)

	if (result.length === 0) {
		res.status(400).json({
			errorMessage: `Account Doesn't Exist`,
			statusCode: errorCode
		})
	}
	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const accountInfo = {
		acc_email:  accEmail ? accEmail : result[0].acc_email,
		acc_phone_number: accPhoneNumber ? accPhoneNumber : result[0].acc_phone_number,
		acc_full_name: accFullName ? accFullName : result[0].acc_full_name,
		acc_updated_date: presentDate
	}

	await accountModel.updateAccount(accIdFlag, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-password', accountValidation.updateAccountPassword, async (req, res) => {
	const { accId, accOldPassword, accNewPassword, accConfirmPassword } = req.body
	const { accRole } = req.account
	
	let accIdFlag = req.account.accId
	
	if (accId) {
		if (roleModel.checkAdminRole(accRole)) {
			accIdFlag = accId
		}
	}

	const accInfo = await accountModel.findById(accIdFlag)

	if (accInfo.length === 0) {
		return res.status(400).json({ 
			errorMessage: 'User Does Not Exist',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accOldPassword, accInfo[0].acc_password)) {
		return res.status(400).json({ 
			errorMessage: 'Password Incorrect',
			statusCode: errorCode
		})
	}

	if (accNewPassword !== accConfirmPassword) {
		return res.status(400).json({
			errorMessage: 'Password Is Different From Confirm Password',
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')

	const hashPassword = bcrypt.hashSync(accNewPassword, 3)
	const accountInfo = {
		acc_password: hashPassword,
		acc_updated_date: presentDate
	}

	await accountModel.updateAccount(accIdFlag, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete', accountValidation.deleteAccount, async (req, res) => {
	const { accId } = req.body
	const { accRole } = req.account

	if (!roleModel.checkAdminRole(accRole)) {
		return res.status(400).json({
			errorMessage: 'Permission Access Denied'
		})
	}

	const checkExist = await accountModel.findById(accId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Account Id',
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	const accountInfo = {
		acc_status: accountModel.accountStatus.inActivatedStatus,
		acc_updated_date: presentDate
	}
	
	await accountModel.updateAccount(accId, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-role', accountValidation.updateRoleAccount, async (req, res) => {
	const { accId, accRole } = req.body
	const presentRole = req.account.accRole

	if (!roleModel.checkAdminRole(presentRole)) {
		return res.status(400).json({
			errorMessage: 'Permission Access Denied'
		})
	}

	const resultRole = await roleModel.findById(accRole)
	const resultAcc = await accountModel.findById(accId)

	if (resultRole.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Role',
			statusCode: errorCode
		})
	}

	if (resultAcc.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Account Id',
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	const accountInfo = {
		acc_role: accRole,
		acc_updated_date: presentDate
	}

	await accountModel.updateAccount(accId, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body
	var avatar = req.files
	const { accRole } = req.account
	
	let accIdFlag = req.account.accId

	if (accId) {
		if (roleModel.checkAdminRole(accRole)) {
			accIdFlag = accId
		}
	}

	const checkAvatar = avatar.image ? true : false

	const result = await accountModel.findById(accIdFlag)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Account Id`,
			statusCode: errorCode
		})
	}

	if (checkAvatar) {
		const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
		const accountInfo = {
			acc_avatar: avatar.image,
			acc_updated_date: presentDate
		}

		await accountModel.updateAccount(accIdFlag, accountInfo)
		
		return res.status(200).json({
			statusCode: successCode
		})
	}

	return res.status(400).json({
		errorMessage: `Image File Is Required`,
		statusCode: errorCode
	})
})

router.post('/delete-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body

	const result = await accountModel.findById(accId)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Account Id'
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	const accountInfo = {
		acc_avatar: null,
		acc_updated_date: presentDate
	}

	await accountModel.updateAccount(accId, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-status', accountValidation.updateStatusAccount, async (req, res) => {
	const { accId, accStatus } = req.body
	const presentRole = req.account.accRole

	if (!roleModel.checkAdminRole(presentRole)) {
		return res.status(400).json({
			statusCode: errorCode,
			errorMessage: `Permission Access Denied`
		})
	}

	if (accStatus !== '0' || accStatus !== '1' && accStatus !== '2') {
		return res.status(400).json({
			statusCode: errorCode,
			errorMessage: `Invalid Status`
		})
	}
	
	const resultAcc = await accountModel.findById(accId)

	if (resultAcc.length === 0) {
		return res.status(400).json({
			errorMessage: `Account Doesn't Exist`,
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	const accountInfo = {
		acc_status: accStatus,
		acc_updated_date: presentDate
	}

	await accountModel.updateAccount(accId, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
