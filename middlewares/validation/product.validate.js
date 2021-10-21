const ajvLib = require('ajv')

const errorCode = 1

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

const productSearching = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			text: { type: 'string' },
			orderMode: {type: 'integer' }
		},
		required: ['text', 'orderMode'],
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
	const validQuery = validatorQuery(req.query)

	if (!validQuery) {
		return res.status(400).json({
			errorMessage: validatorQuery.errors[0].message,
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

	const validatorBody = ajv.compile(shemaBody)
	const validBody = validatorBody(req.body)

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
	const validQuery = validatorQuery(req.query)
	
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

module.exports = {
	queryInfo,
	productSearching,
	listWithCate,
	details
}
