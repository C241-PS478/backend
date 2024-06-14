import { server as _server } from "@hapi/hapi"
import routes from "./routes/index.js"
import { generateInternalServerErrorResponse } from "./handlers/index.js"

const init = async () => {
	const server = _server({
		port: 3000,
		host: "localhost",
		routes: {
			cors: {
				origin: ["*"],
			},
		},
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