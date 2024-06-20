// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnector.js"
import { uploadBufferToCloudStorage } from "../../services/cloudStorageConnector.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllProductsHandler = async (request, h) => {

	const products = await prisma.product.findMany({
		skip: (request.query.page || 0) * 10,
		take: 10,
		include: {
			author: true
		},
	})

	delete product?.author?.password

	const response = h.response({
		data: products
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getProductHandler = async (request, h) => {
	const product = await prisma.waterProduct.findUnique({
		where: {
			id: request.params.id
		},
	})

	if (!product) {
		const response = h.response({
			message: "Product not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: product
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const createProductHandler = async (request, h) => {
	// TODO image upload

	if (request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to create products.",
		})
		response.code(403)
		return response
	}

	const product = await prisma.product.create({
		data: {
			name: request.payload.name,
			category: request.payload.category,
			price: Number(request.payload.price),
			url: request.payload.url,
			imageUrl: request.payload.imageUrl,
		},
	})

	const response = h.response({
		data: product
	})

	response.code(201)
	return response
}


/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateProductHandler = async (request, h) => {
	let product = await prisma.product.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!product) {
		const response = h.response({
			message: "Product not found.",
		})
		response.code(404)
		return response
	}

	if (request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to update this product.",
		})
		response.code(403)
		return response
	}

	// TODO image upload

	product = await prisma.product.update({
		where: {
			id: request.params.id
		},
		data: {
			name: request.payload.name,
			category: request.payload.category,
			price: Number(request.payload.price),
			url: request.payload.url,
			imageUrl: request.payload.imageUrl,
		},
	})

	
	delete product?.author?.password

	const response = h.response({
		message: "Product updated.",
		data: product
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deleteProductHandler = async (request, h) => {
	let product = await prisma.product.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!product) {
		const response = h.response({
			message: "Product not found.",
		})
		response.code(404)
		return response
	}

	if (request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to delete this product.",
		})
		response.code(403)
		return response
	}

	product = await prisma.waterProduct.delete({
		where: {
			id: request.params.id
		}
	})

	const response = h.response({
		message: "Product deleted."
	})

	response.code(204)
	return response
}
