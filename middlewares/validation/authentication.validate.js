const ajvLib = require('ajv')

const errorCode = 1

const login = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accEmail: { type: 'string', pattern: '' },
			accPassword: { type: 'string', pattern: '' }
		},
		required: ['accEmail', 'accPassword'],
		additionalProperties: false
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

const register = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		accPassword: { type: 'string', pattern: '', minLength: 1, maxLength: 36 },
    		accEmail: { type: 'string', pattern: '^[a-z][a-z0-9_\.]{5,30}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$', maxLength: 100 },
    		accPhoneNumber: { type: 'string', pattern: '', maxLength: 15 },
			accFullName: { type: 'string', pattern: '', maxLength: 100 },
    		accRole: { type: 'string', pattern: '', maxLength: 5}
  		},
		required: ['accPassword', 'accEmail'],
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

const confirmToken = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accToken: { type: 'string', pattern: '' },
			accId: { type: 'integer' }
		},
		required: ['accToken', 'accId'],
		additionalProperties: false
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



const forgotPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accEmail: { type: 'string', pattern: '^[a-z][a-z0-9_\.]{5,30}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$', maxLength: 100 }
		},
		required: ['accEmail'],
		additionalProperties: false
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

const newPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accPassword: { type: 'string', pattern: '' , minLength: 1 },
			tokenChangePass: { type: 'string', pattern: '' },
			accId: { type: 'integer' }
		},
		required: ['accPassword', 'tokenChangePass', 'accId'],
		additionalProperties: false
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

const refreshToken = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accessToken: { type: 'string', pattern: '' },
			refreshToken: { type: 'string', pattern: '' }
		},
		required: ['accessToken', 'refreshToken'],
		additionalProperties: false
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
    login,
    register,
    confirmToken,
    forgotPassword,
    newPassword,
	refreshToken
}