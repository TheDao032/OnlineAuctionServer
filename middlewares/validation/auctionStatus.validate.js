const ajvLib = require('ajv')

const errorCode = 1

const cancle = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodId: { type: 'integer' },
		},
		required: ['prodId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.query)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const offer = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodId: { type: 'integer' },
			bidderId: { type: 'integer' },
		},
		required: ['prodId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.query)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

module.exports = {
	cancle,
	offer
}
