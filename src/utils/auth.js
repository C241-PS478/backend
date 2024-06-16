export const getTokenFromAuthorization = (headerValue) => {
	const [type, token] = headerValue.split(' ')
	if (type !== 'Bearer') {
		throw new Error('Invalid token type')
	}
	return token
}

export const sanitizeUser = user => {
	if (!user) return user
	delete user.password
	return user
}
