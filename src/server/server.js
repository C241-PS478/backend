import Hapi from "@hapi/hapi"
import routes from "./routes/index.js"
import { generateInternalServerErrorResponse } from "./handlers/index.js"
import AuthBearer from 'hapi-auth-bearer-token'
import { getUserFromEitherTokens } from "../services/localUserService.js"
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'
import os from 'os'
import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

const init = async () => {

	const serverOptions = {
		port: 3000,
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
	await server.register([
		Inert,
		Vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: "WaterWise Main Backend Service",
					version: packageJson.version,
				},
				grouping: 'tags',
				documentationPath: '/docs',
			}
		}
	])

	server.auth.strategy('simple', 'bearer-access-token', {
		validate: async (request, token, h) => {
			try {
				const artifacts = await getUserFromEitherTokens(token)
				if (artifacts) return { isValid: true, credentials: { token }, artifacts }
			} catch (error) { }
			return { isValid: false, credentials: {}, artifacts: {} }
		}
	})

	server.auth.strategy('optional', 'bearer-access-token', {
		validate: async (request, token, h) => {
			if (!token) return { isValid: true, credentials: {}, artifacts: {} }
			try {
				const artifacts = await getUserFromEitherTokens(token)
				return { isValid: true, credentials: { token }, artifacts }
			} catch (error) { }
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

	const interfaces = os.networkInterfaces()
	const ips = Object.keys(interfaces).reduce((acc, interfaceName) => {
		const interfaceIps = interfaces[interfaceName].map((ip) => {
			if (ip.family === "IPv6") return `[${ip.address}]`
			return ip.address
		})
		return acc.concat(interfaceIps)
	}, [])
	console.info(`Server running on ${server.info.uri}.
Open on:
\t- http://localhost:${server.info.port}
\t- http://127.0.0.1:${server.info.port}
\t- http://[::1]:${server.info.port}
${ips.map((ip) => {
		if (ip === "127.0.0.1" || ip === "[::1]") return undefined
		return `\t- http://${ip}:${server.info.port}`
	}).filter(_ => _).join('\n')}`)
}

init()