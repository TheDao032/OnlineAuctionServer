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

const queryInfo = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		page: { type: 'string', pattern: '^\\d+$' },
			limit: { type: 'string', pattern: '^\\d+$' }
  		},
		required: [],
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

const updateProduct = (req, res, next) => {
	const shemaBody = {
		type: 'object',
		properties: {
			prodId: { type: 'string', pattern: '^\\d+$' },
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

const addImage = (req, res, next) => {
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
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const listWithCate = (req, res, next) => {
	const shemaBody = {
		type: 'object',
		properties: {
			cateId: { type: 'integer' }
		},
		required: ['cateId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validatorBody = ajv.compile(shema)
	const validBody = validator(req.body)

	const shemaQuery = {
		type: 'object',
		properties: {
		  page: { type: 'string', pattern: '^\\d+$' },
		  limit: { type: 'string', pattern: '^\\d+$' }
		},
		required: [],
		additionalProperties: true
	}

	const validatorQuery = ajv.compile(shemaQuery)
	const validQuery = validator(req.query)
	
	if (!validBody) {
		return res.status(400).json({
			errorMessage: validatorBody.errors[0].message,
			statusCode: errorCode
		})
	}

	if (!validQuery) {
		return res.status(400).json({
			errorMessage: validatorQuery.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const details = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodId: { type: 'integer' }
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
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

module.exports = {
	newProduct,
	queryInfo,
	updateProduct,
	productSearching,
	updateImage,
	updateDescription,
	listWithCate,
	addImage,
	details
}