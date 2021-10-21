const ajvLib = require('ajv')

const errorCode = 1

const listComment = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			bidderId: { type: 'integer' }
		},
		required: ['bidderId'],
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

const newComment = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			bidderId: { type: 'integer' },
			prodId: { type: 'integer' },
			cmtContent: { type: 'string', pattern: '' , maxLength: 200 },
			cmtVote: { type: 'integer' }
		},
		required: ['prodId', 'bidderId', 'cmtContent', 'cmtVote'],
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

const badComment = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			bidderId: { type: 'integer' },
			prodId: { type: 'integer' },
			sellerId: { type: 'integer' }
		},
		required: ['prodId', 'bidderId', 'sellerId'],
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

const updateComment  = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			cmtId: { type: 'integer' },
			cmtContent: { type: 'string', pattern: '',  maxLength: 200},
			cmtVote: { type: 'integer' }
		},
		required: ['cmtId'],
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

const deleteComment  = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			cmtId: { type: 'integer' }
		},
		required: ['cmtId'],
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
    newComment,
	updateComment,
	deleteComment,
	listComment,
	badComment
}
