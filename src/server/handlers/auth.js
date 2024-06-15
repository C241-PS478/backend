import { getFirebaseUserLocalInfo } from "../../services/firebaseUserConnector.js"
import { devLoginUser, getUserFromEitherTokens, loginUser, registerUser } from "../../services/localUserService.js"
import { getTokenFromAuthorization } from "../../utils/auth.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const loginHandler = async (request, h) => {
	let user, token
	try {
		({ user, token } = loginUser({
			username: request.payload.username,
			password: request.payload.password
		}))
	} catch (e) {
		if (e.message === "User not found" || e.message === "Invalid password") {
			const response = h.response({
				message: "Wrong credentials.",
			})
			response.code(400)
			return response
		}
	}

	const response = h.response({
		message: "Login successful!",
		data: {
			user,
			token
		}
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const registerHandler = async (request, h) => {
	const { user, token } = await registerUser({
		email: request.payload.email,
		username: request.payload.username,
		name: request.payload.name,
		password: request.payload.password
	})

	const response = h.response({
		message: "Registration successful!",
		data: {
			user,
			token
		}
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const devLoginHandler = async (request, h) => {
	const { user, token } = await devLoginUser(request.payload.username)

	const response = h.response({
		message: "Login successful!",
		data: {
			user,
			token
		}
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const loginGoogleHandler = async (request, h) => {
	if (!request.headers.authorization) {
		const response = h.response({
			message: "Authorization header missing.",
		})
		response.code(400)
		return response
	}

	const token = getTokenFromAuthorization(request.headers.authorization)
	const user = await getFirebaseUserLocalInfo(token)

	const response = h.response({
		message: "Login successful!",
		data: {
			user,
			token
		}
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getUserHandler = async (request, h) => {
	if (!request.headers.authorization) {
		const response = h.response({
			message: "Authorization header missing.",
		})
		response.code(400)
		return response
	}

	const token = getTokenFromAuthorization(request.headers.authorization)
	const user = await getUserFromEitherTokens(token)

	if (!user) {
		const response = h.response({
			message: "User not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: user
	})

	response.code(200)
	return response
}