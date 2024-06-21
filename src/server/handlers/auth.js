import { getFirebaseUserLocalInfo } from "../../services/firebaseUserConnector.js"
import { devLoginUser, getUser, getUserFromEitherTokens, loginFirebaseUser, loginUser, registerUser, updateUser } from "../../services/localUserService.js"
import { getTokenFromAuthorization } from "../../utils/auth.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const loginHandler = async (request, h) => {
	let data
	try {
		data = await loginUser({
			username: request.payload.username,
			password: request.payload.password
		})
	} catch (e) {
		if (e.message === "User not found" || e.message === "Invalid password") {
			const response = h.response({
				message: "Wrong credentials.",
			})
			response.code(400)
			return response
		}
		throw e
	}

	const response = h.response({
		message: "Login successful!",
		data
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
	let data
	try {
		data = await registerUser({
			email: request.payload.email,
			username: request.payload.username,
			name: request.payload.name,
			password: request.payload.password,
			phoneNumber: request.payload.phoneNumber,
		})
	} catch (e) {
		if (e.code === "P2002") {
			const response = h.response({
				message: "Username and/or email already taken."
			})
			response.code(400)
			return response
		}
		throw e
	}

	const response = h.response({
		message: "Registration successful.",
		data
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
		message: "Login successful.",
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
	const { user, token } = await loginFirebaseUser(request.auth.credentials.token)
	
	const response = h.response({
		message: "Login successful.",
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
export const getOwnUserHandler = async (request, h) => {
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

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateOwnUserHandler = async (request, h) => {
	if (!request.auth.artifacts.isAdmin) {
		delete request.payload.isAdmin
	}

	let updatedUser

	// TODO Add address

	try {
		updatedUser = await updateUser(request.auth.artifacts.id, {
			"username": request.payload.username,
			"password": request.payload.password,
			"email": request.payload.email,
			"name": request.payload.name,
			"isAdmin": request.payload.isAdmin,
			"phoneNumber": request.payload.phoneNumber,
		})
	} catch (e) {
		if (e.code === "P2002") {
			const response = h.response({
				message: "Username already taken.",
			})
			response.code(400)
			return response
		}
		throw e
	}
	
	const response = h.response({
		message: "User updated.",
		data: updatedUser
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
	if (request.auth.artifacts.isAdmin === false && request.auth.artifacts.id !== request.params.id) {
		const response = h.response({
			message: "You are not allowed to view this user.",
		})
		response.code(403)
		return response
	}
	
	const user = await getUser(request.params.id)

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

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateUserHandler = async (request, h) => {
	if (request.auth.artifacts.isAdmin === false && request.auth.artifacts.id !== request.params.id) {
		const response = h.response({
			message: "You are not allowed to update this user.",
		})
		response.code(403)
		return response
	}

	if (!request.auth.artifacts.isAdmin) {
		delete request.payload.isAdmin
	}

	let updatedUser

	try {
		updatedUser = await updateUser(request.params.id, {
			"username": request.payload.username,
			"password": request.payload.password,
			"email": request.payload.email,
			"name": request.payload.name,
			"isAdmin": request.payload.isAdmin,
			"phoneNumber": request.payload.phoneNumber,
		})
	} catch (e) {
		if (e.code === "P2002") {
			const response = h.response({
				message: "Username already taken.",
			})
			response.code(400)
			return response
		} else if (e.code === "P2025") {
			const response = h.response({
				message: "User not found.",
			})
			response.code(404)
			return response
		}
		throw e
	}

	const response = h.response({
		message: "User updated.",
		data: updatedUser
	})
	response.code(200)
	return response
}