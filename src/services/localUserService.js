import { prisma } from './databaseConnector.js'
import * as hasha from 'hasha'
import * as jose from 'jose'
import { getFirebaseUserLocalInfo } from './firebaseUserConnector.js'

/**
 * @param {string} potentialUsername 
 * @returns String
 */
export const getPotentialUsername = async potentialUsername => {
	let initialPotentialUsername = potentialUsername
	let usernameSuffix = 1
	while (true) {
		if (checkUsernameAvailability(potentialUsername)) {
			break
		}
		potentialUsername = initialPotentialUsername + usernameSuffix
	}
	return potentialUsername
}

/**
 * @param {string} username 
 * @returns String
 */
export const checkUsernameAvailability = async username => {
	const foundUsers = await prisma.user.findMany({
		where: {
			username
		}
	})

	return foundUsers.length === 0
}

const generatePasswordHash = (password, salt) => {
	if (salt) {
		password += salt
	}
	return hasha.hashSync(password)
}

const jwtSecret = new TextEncoder().encode(process.env.SECRET_KEY)

/**
 * @param {import('@prisma/client').User} user 
 * @returns String
 */
const generateJwtToken = async user => {
	return await new jose.SignJWT({
		'id': user.id,
		'isAdmin': user.isAdmin
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setIssuer('urn:waterwise:auth')
		.setAudience(`urn:waterwise:user`)
		.setExpirationTime('1y')
		.sign(jwtSecret)
}


const getJwtPayload = async token => {
	const { payload, protectedHeader } = await jose.jwtVerify(token, jwtSecret, {
		issuer: 'urn:waterwise:auth',
		audience: 'urn:waterwise:user'
	})
	return payload
}

export const registerUser = async registerDto => {

	if (checkUsernameAvailability(registerDto.username)) {
		throw new Error('Username already taken')
	}

	let newUser = await prisma.user.create({
		data: {
			email: registerDto.email,
			username: registerDto.username,
			name: registerDto.name
		}
	})

	const passwordHash = generatePasswordHash(registerDto.password, newUser.id)

	newUser = await prisma.user.update({
		where: {
			id: newUser.id
		},
		data: {
			password: passwordHash
		}
	})

	return {
		user: newUser,
		token: await generateJwtToken(newUser)
	}
}

export const loginUser = async loginDto => {
	const user = await prisma.user.findUnique({
		where: {
			username: loginDto.username
		}
	})

	if (!user) {
		throw new Error('User not found')
	}

	const passwordHash = generatePasswordHash(loginDto.password, user.id)

	if (user.password !== passwordHash) {
		throw new Error('Invalid password')
	}

	return {
		user: user,
		token: await generateJwtToken(user)
	}
}

export const devLoginUser = async username => {
	let user = await prisma.user.findUnique({
		where: {
			username
		}
	})

	if (user && !user.email.endsWith('dev.waterwise.bangkit.academy')) {
		throw new Error('User already exists')
	}

	if (!user) {
		user = await prisma.user.create({
			data: {
				email: `${username}@dev.waterwise.bangkit.academy`,
				username,
				name: username,
				isAdmin: username.startsWith('admin')
			}
		})
	}

	return {
		user: user,
		token: await generateJwtToken(user)
	}
}

export const getUserFromToken = async token => {
	const payload = await getJwtPayload(token)
	return await prisma.user.findUnique({
		where: {
			id: payload.id
		}
	})
}

export const getUserFromEitherTokens = async token => {
	try {
		return await getUserFromToken(token)
	} catch (e) {}
	try {
		return await getFirebaseUserLocalInfo(token)
	} catch (e) {}
}