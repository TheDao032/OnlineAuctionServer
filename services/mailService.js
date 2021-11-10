const knex = require('../utils/dbConnection')
const bcrypt = require('bcrypt')
const sendgrid = require('@sendgrid/mail')
const environment = require('../environments/environment')
const nodemailer = require('nodemailer')

const errorCode = 1
const successCode = 0

var transporter = nodemailer.createTransport(`smtps://${environment.mailConfig.user}:${environment.mailConfig.password}@smtp.gmail.com`)


const sendMail = async (mailOptions, req, res) => {

    // sendgrid.setApiKey(environment.SENDGRID_API_KEY)

    
    // await sendgrid.send(mailOptions, (error, result) => {
	// 	if (error) {
	// 		return res.status(500).json({
	// 			errorMessage: error,
	// 			statusCode: errorCode
	// 		})
	// 	}
	// })

	await transporter.sendMail(mailOptions, (error, result) => {
		if (error) {
			return res.status(500).json({
				errorMessage: error,
				statusCode: errorCode
			})
		}
	})
}

module.exports = {
    sendMail
}