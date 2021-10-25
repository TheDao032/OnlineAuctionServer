const ajvLib = require('ajv')

const errorCode = 1

const listAuction = (req, res, next) => {
    const shemaBody = {
        type: 'object',
  		properties: {
    		prodId: { type: 'integer' }
  		},
		required: [],
		additionalProperties: true
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

	const ajv = new ajvLib({
		allErrors: true
	})

	const validatorQuery = ajv.compile(shemaQuery)
	const validQuery = validatorQuery(req.query)

	if (!validQuery) {
		return res.status(400).json({
			errorMessage: validatorQuery.errors[0].message,
			statusCode: errorCode
		})
	}

    const validatorBody = ajv.compile(shemaQuery)
	const validBody = validatorBody(req.body)

	if (!validBody) {
		return res.status(400).json({
			errorMessage: validatorBody.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

module.exports = {
    listAuction
}
