const ajvLib = require('ajv')

const errorCode = 1

const cancel = (req, res, next) => {
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
	const valid = validator(req.body)

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
			aucPriceOffer: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
		},
		required: ['prodId', 'aucPriceOffer'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

module.exports = {
	cancel,
	offer
}
