// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnector.js"
import { generateWrongParameterResponse } from "./index.js"
import { getReverseGeocode } from "../../services/googleMapsApi.js"
import { db } from "../../services/firestoreConnector.js"
import { uploadBufferToCloudStorage } from "../../services/cloudStorageConnector.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllArticlesHandler = async (request, h) => {

	const articles = await prisma.article.findMany({
		skip: (request.query.page || 0) * 10,
		take: 10,
		include: {
			author: true
		},
	})

	delete article?.author?.password

	const response = h.response({
		data: articles
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getArticleHandler = async (request, h) => {
	const article = await prisma.waterArticle.findUnique({
		where: {
			id: request.params.id
		},
		include: {
			author: true,
		},
	})

	delete article?.author?.password

	if (!article) {
		const response = h.response({
			message: "Article not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: article
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const createArticleHandler = async (request, h) => {
	// TODO image upload
	
	const article = await prisma.article.create({
		data: {
			author: {
				connect: {
					id: request.auth.artifacts.id
				}
			},
			content: request.payload.content,
			title: request.payload.title,

		},
		include: {
			author: true,
			prediction: true,
		},
	})

	delete article?.author?.password

	const response = h.response({
		data: article
	})

	response.code(201)
	return response
}


/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateArticleHandler = async (request, h) => {
	let article = await prisma.article.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!article) {
		const response = h.response({
			message: "Article not found.",
		})
		response.code(404)
		return response
	}

	if (article.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to update this article.",
		})
		response.code(401)
		return response
	}

	// TODO image upload

	article = await prisma.article.update({
		where: {
			id: request.params.id
		},
		data: {
			title: request.payload.title,
			content: request.payload.content,
			dateModified: new Date().toISOString()
		},
		include: {
			address: true,
			author: true,
		},
	})

	
	delete article?.author?.password

	const response = h.response({
		message: "Article updated.",
		data: article
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deleteArticleHandler = async (request, h) => {
	let article = await prisma.article.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!article) {
		const response = h.response({
			message: "Article not found.",
		})
		response.code(404)
		return response
	}

	if (article.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to delete this article.",
		})
		response.code(403)
		return response
	}

	article = await prisma.waterArticle.delete({
		where: {
			id: request.params.id
		}
	})

	const response = h.response({
		message: "Article deleted."
	})

	response.code(204)
	return response
}
