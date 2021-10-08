const ajvLib = require('ajv')

const errorCode = 1

const newProduct = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodName: { type: 'string', maxLength: 60 },
			prodCateId: { type: 'string', pattern: '^\\d+$' },
			prodBeginPrice: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
			prodStepPrice: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
			prodBuyPrice: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
			prodDescription: { type: 'string' },
		},
		required: ['prodName', 'prodCateId', 'prodStepPrice'],
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

const paramsInfo = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		id: { type: 'string', pattern: '^\\d+$' }
  		},
		required: ['id'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.params)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const updateProduct = (req, res, next) => {
	const shemaBody = {
		type: 'object',
		properties: {
			prodId: { type: 'integer' },
			prodName: { type: 'string', maxLength: 60 },
			prodCateId: { type: 'string', pattern: '^\\d+$' },
			prodBeginPrice: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
			prodStepPrice: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
			prodBuyPrice: { type: 'string', pattern: '^\\d*[.]?\\d+$', minLength: 1 },
		},
		required: ['prodId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validatorBody = ajv.compile(shemaBody)
	const validBody = validatorBody(req.body)

	if (!validBody) {
		return res.status(400).json({
			errorMessage: validParams.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const updateImage = (req, res, next) => {
	const shemaBody = {
		type: 'object',
		properties: {
			prodId: { type: 'string', pattern: '^\\d+$' },
		},
		required: ['prodId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validatorBody = ajv.compile(shemaBody)
	const validBody = validatorBody(req.body)

	if (!validBody) {
		return res.status(400).json({
			errorMessage: validParams.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const updateDescription = (req, res, next) => {
	const shemaBody = {
		type: 'object',
		properties: {
			prodId: { type: 'string', pattern: '^\\d+$' },
			prodDescription: { type: 'string', minLength: 1 }
		},
		required: ['prodId', 'prodDescription'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validatorBody = ajv.compile(shemaBody)
	const validBody = validatorBody(req.body)

	if (!validBody) {
		return res.status(400).json({
			errorMessage: validParams.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const productSearching = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodName: { type: 'string' }
		},
		required: [],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: "Value " + validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}
module.exports = {
	newProduct,
	paramsInfo,
	updateProduct,
	productSearching,
	updateImage,
	updateDescription
}