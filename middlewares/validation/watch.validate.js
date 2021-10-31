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

const addWatch = (req, res, next) => {
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

// const checkPrice = (req, res, next) => {
// 	const shema = {
//   		type: 'object',
//   		properties: {
// 			listProduct: { 
// 				type: 'array',
// 				items: {
// 					type: 'object',
//   					properties: {
// 						prodId: { type: 'integer' },
// 						cardAmount: { type: 'integer' }
//   					},
// 					required: ['prodId'],
// 					additionalProperties: true
// 				}
// 			}
//   		},
// 		required: ['listProduct'],
// 		additionalProperties: true
// 	}

// 	const ajv = new ajvLib({
// 		allErrors: true
// 	})

// 	const validator = ajv.compile(shema)
// 	const valid = validator(req.body)

// 	if (!valid) {
// 		return res.status(400).json({
// 			errorMessage: validator.errors[0].message,
// 			statusCode: errorCode
// 		})
// 	}

// 	next()
// }

const deleteWatch = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			watchId: { type: 'integer' }
  		},
		required: ['watchId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allerrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errormessage: validator.errors[0].message,
			statuscode: errorCode
		})
	}

	next()
}

module.exports = {
    addWatch,
	queryInfo,
	deleteWatch
}
