const ajvLib = require('ajv')

const errorCode = 1

const newCategoryFather = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateName: { type: 'string', pattern: '', minLength: 1, maxLength: 100 }
  		},
		required: ['cateName'],
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

const newCategoryChild = (req, res, next) => {
	const shemaBody = {
  		type: 'object',
  		properties: {
			cateName: { type: 'string', pattern: '', minLength: 1, maxLength: 100 },
			cateFather: { type: 'integer' }
  		},
		required: ['cateName', 'cateFather'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})


	const validatorBody = ajv.compile(shemaBody)
	const validBody = validatorBody(req.body)


	if (!validBody) {
		return res.status(400).json({
			errorMessage: validBody.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const updateCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		cateId: { type: 'integer' },
			cateName: { type: 'string', pattern: '', minLength: 1, maxLength: 100 },
			cateFather: { type: 'integer' }
  		},
		required: ['cateId'],
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

const listCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateFather: { type: 'integer' }
  		},
		required: ['cateFather'],
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

const deleteCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateId: { type: 'integer' },
  		},
		required: ['cateId'],
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

module.exports = {
    newCategoryFather,
    newCategoryChild,
    listCategoryChild,
	deleteCategory,
	updateCategory,
	queryInfo
}
