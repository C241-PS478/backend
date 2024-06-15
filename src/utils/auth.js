export const getTokenFromAuthorization = (headerValue) => {
	const [type, token] = headerValue.split(' ')
	if (type !== 'Bearer') {
		throw new Error('Invalid token type')
	}
	return token
}