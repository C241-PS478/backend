// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnect.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const helloTestHandler = (request, h) => {
	const response = h.response({
		message: "Hello world!",
	})

	response.code(200)
	return response
}
  
/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const createUserHandler = async (request, h) => {

	console.log(request.payload)

	const newUser = await prisma.user.create({
		data: {
			"name": request.payload.name,
			"password": "1234",
			"username": request.payload.username.replace(/\s+/, "-")
		}
	})


	const response = h.response({
		message: request.payload.user,
		data: newUser
	})

	// await prisma.user.delete({
	// 	where: {
	// 		id: newUser.id
	// 	}
	// })

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllUserHandler = async (request, h) => {

	const response = h.response({
		data: await prisma.user.findMany()
	})

	response.code(200)
	return response
}


/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deleteAllUserHandler = async (request, h) => {

	await prisma.user.deleteMany()

	const response = h.response({
		"message": "Success!"
	})

	response.code(204)
	return response
}