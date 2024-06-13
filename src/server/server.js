import { server as _server } from "@hapi/hapi"
import routes from "./routes/index.js"

const init = async () => {
	const server = _server({
		port: 5000,
		host: "localhost",
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	})

	server.route(routes)

	// server.ext("onPreResponse", function (request, h) {
	// 	const response = request.response
	// 	const output = response.output
	// 	if (response.isBoom) {
	// 		console.log(output)
	// 		const newResponse = h.response({
	// 			message: output.payload.message,
	// 			error: output.payload.error
	// 		})
	// 		newResponse.code(output.statusCode)
	// 		return newResponse
	// 	}
	// 	return h.continue
	// })

	await server.start()
	// eslint-disable-next-line no-console
	console.log(`Server berjalan pada ${server.info.uri}`)
}

init()