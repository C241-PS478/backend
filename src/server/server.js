import Hapi from "@hapi/hapi"
import routes from "./routes/index.js"
import { generateInternalServerErrorResponse } from "./handlers/index.js"
import AuthBearer from 'hapi-auth-bearer-token'
import { getUserFromEitherTokens } from "../services/localUserService.js"

const init = async () => {

	const serverOptions = {
		port: 3000,
		host: "localhost",
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	}

	if (process.env.NODE_ENV !== "production") {
		serverOptions.debug = { request: ["error"] }
	}

	const server = Hapi.server(serverOptions)


	await server.register(AuthBearer)
	
	server.auth.strategy('simple', 'bearer-access-token', {
		validate: async (request, token, h) => {
			try {
				const artifacts = await getUserFromEitherTokens(token)
				return { isValid: true, credentials: { token }, artifacts }
			} catch (error) {}
			return { isValid: false, credentials: {}, artifacts: {} }
		}
	})

	server.auth.strategy('optional', 'bearer-access-token', {
		validate: async (request, token, h) => {
			if (!token) return { isValid: true, credentials: {}, artifacts: {} }
			try {
				const artifacts = await getUserFromEitherTokens(token)
				return { isValid: true, credentials: { token }, artifacts }
			} catch (error) {}
			return { isValid: true, credentials: {}, artifacts: {} }
		}
	})

	server.route(routes)

	if (process.env.NODE_ENV === "production") server.ext("onPreResponse", function (request, h) {
		const response = request.response
		const output = response.output
		if (response.isBoom) {
			if (output.statusCode === 500) {
				return generateInternalServerErrorResponse(h)
			}
			const newResponse = h.response({
				message: output.payload.message,
				error: output.payload.error
			})
			newResponse.code(output.statusCode)
			return newResponse
		}
		return h.continue
	})

	await server.start()
	// eslint-disable-next-line no-console
	console.info(`Server running on ${server.info.uri}.`)
}

init()