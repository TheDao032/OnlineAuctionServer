const express = require('express')
const jsonWebToken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const environment = require('../environments/environment')

const authenticationService = require('../services/authenticationService')
const authenticationValidate = require('../middlewares/validation/authentication.validate')
const mailService = require('../services/mailService')
const mailOptions = require('../template/mailOptions')

const accountModel = require('../models/account.model')

const errorCode = 1
const successCode = 0

router.post('/login', authenticationValidate.login, (req, res) => {
	const { accEmail, accPassword } = req.body

	authenticationService.authenticate(accEmail, accPassword, async (err, auth = null, user = null) => {
		if (err) {
			res.status(500).json({
				err,
				statusCode: 2
			})
			return
		}

		const accessToken = jsonWebToken.sign(auth, environment.secret, {
			expiresIn: '1h',
			algorithm: 'HS256'
		})

		var refreshToken = randomstring.generate(100)

		await accountModel.updateRefreshToken(user.accId, refreshToken)

		res.status(200).json({
			statusCode: successCode,
			data: {
				user,
				accessToken,
				refreshToken
			}
		})
	}, req, res)
})

router.post('/register', authenticationValidate.register, async (req, res) => {
	const { accPassword, accEmail, accFullName, accPhoneNumber } = req.body
	

	const checkExistEmail = await accountModel.findByEmail(accEmail)

	if (checkExistEmail.length != 0) {
		return res.status(400).json({
			errorMessage: 'Email Has Already Existed',
			statusCode: errorCode
		})
	}

	var token = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()

	const hashPassword = bcrypt.hashSync(accPassword, 3)
	const hashToken = bcrypt.hashSync(token, 3)

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	
	const accountInfo = {
		acc_password: hashPassword,
		acc_email: accEmail,
		acc_phone_number: accPhoneNumber || null,
		acc_full_name: accFullName || null,
		acc_role: 'BID',
		acc_token: hashToken,
		acc_created_date: presentDate
	}

	const newAccId = await knex('tbl_account')
	.returning('acc_id')
	.insert(accountInfo)

	await mailService.sendMail(mailOptions.registerOptions(accEmail, accEmail, token), req, res)

	return res.status(200).json({
		statusCode: successCode,
		accId: newAccId[0]
	})
})

router.post('/verification-email', authenticationValidate.confirmToken, async (req, res) => {
	const { accToken, accId }  = req.body
	
	const result = await accountModel.findById(accId)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'Invalid Account Id',
			statusCode: errorCode
		})
	}

	if (result[0].acc_token === null) {
		return res.status(400).json({
			errorMessage: 'Your Account Has Already Vefified',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accToken, result[0].acc_token)) {
		return res.status(400).json({
			errorMessage: 'Invalid Token',
			statusCode: errorCode
		})
	}

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	var accountInfo = {
		acc_token: null,
		acc_status: accountModel.accountStatus.activatedStatus,
		acc_updated_date: presentDate
	}
	

	await accountModel.update(accId, accountInfo)

	return res.status(200).json({
		statusCode: successCode
	})	
})

router.post('/forgot-password', authenticationValidate.forgotPassword, async (req, res) => {
	const { accEmail }  = req.body

	const result = await accountModel.findByEmail(accEmail)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: `Email Doesn't Exist`,
			statusCode: errorCode
		})
	}

	let token = 'f' + (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()

	const cusName = result[0].acc_email
	await mailService.sendMail(mailOptions.forgotPasswordOptions(accEmail, cusName, token), req, res)
	const hashToken = bcrypt.hashSync(token, 3)
	
	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	const accountInfo = {
		acc_token_forgot: hashToken,
		acc_updated_date: presentDate
	}

	await accountModel.update(result[0].acc_id, accountInfo)

	return res.status(200).json({
		statusCode: successCode,
		accId: result[0].acc_id
	})
})

router.post('/new-password', authenticationValidate.newPassword, async (req, res) => {
	const { accPassword, tokenChangePass, accId }  = req.body

	const accountInfo = await accountModel.findById(accId)

	if (!bcrypt.compareSync(tokenChangePass, accountInfo[0].acc_token_forgot)) {
		return res.status(400).json({
			errorMessage: `Invalid Token`,
			statusCode: errorCode
		})
	}

	const hashPassWord = bcrypt.hashSync(accPassword, 3)

	const presentDate = moment().format('YYYY-MM-DD HH:mm:ss')
	const newAccountInfo = {
		acc_password: hashPassWord,
		acc_token_forgot: null,
		acc_updated_date: presentDate
	}

	await accountModel.update(accId, newAccountInfo)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/refresh-token', authenticationValidate.refreshToken, async (req, res) => {
	const { accessToken, refreshToken } = req.body

	jsonWebToken.verify(accessToken, environment.secret, { ignoreExpiration: true }, async (err, decode) => {
        if (err) {
			return res.status(500).json({
                err,
                statusCode: 3,
            })
		}

		const { accId } = decode

		if (accountModel.isValidRefreshToken(accId, refreshToken)) {
			const newAccessToken = jsonWebToken.sign(auth, environment.secret, {
				expiresIn: '1h',
				algorithm: 'HS256'
			})
			
			res.status(200).json({
				statusCode: successCode,
				accessToken: newAccessToken
			})
		}

		return res.status(400).json({
			errorMessage: 'InValid Refresh Token',
			statusCode: 2,
		})
    })
})

module.exports = router
