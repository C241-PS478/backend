import Joi from 'joi'

export const joiAuthorizationHeader = (description = 'Authorization token in form of a bearer JWT token.', required = true, additionalFields) => {
	const Authorization = Joi.string()
		.pattern(new RegExp('^Bearer [a-zA-Z0-9]{1,}$'))
		.description(description)

	if (required) {
		Authorization.required()
	}

	return Joi.object({
		Authorization,
		...additionalFields
	}).unknown(true)
}