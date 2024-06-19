// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnector.js"
import { generateWrongParameterResponse } from "./index.js"
import { uploadBufferToCloudStorage } from "../../services/cloudStorageConnector.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const predictHandler = async (request, h) => {
	
	const image = request.payload.image

	if (!image) {
		const response = h.response({
			message: "No image supplied.",
		})
		response.code(400)
		return response
	}

	let filename = image.hapi.filename
	filename = `${Date.now()}${filename.substring(filename.lastIndexOf("."))}`

	// TODO move this to services folder
	let formData = new FormData()
	// formData.append('image', image, filename)
	formData.append('image', new Blob([image._data], { type: image.hapi.headers['content-type'] }), filename)

	let mlResponseRaw

	try {
		await fetch(`${process.env.ML_API_URL}/clean-water/with-extraction`, {
			method: "POST",
			body: formData
		})
	} catch (e) {
		if (e?.response?.status === 400) {
			const response = h.response({
				message: `Invalid image: ${e.response.data.message}`
			})
			response.code(400)
			return response
		}
		throw e
	}
				
	const mlResponse = await mlResponseRaw.json()

	const prediction = mlResponse.data.prediction

	const imageUrl = await uploadBufferToCloudStorage(image, `prediction-images/${filename}`, )

	const predictionData = await prisma.waterPrediction.create({
		data: {
			author: {
				connect: {
					id: request.auth.artifacts.id
				}
			},
			imageUrl: imageUrl,
			prediction: prediction
		}
	})

	const response = h.response({
		message: "Prediction successful.",
		data: predictionData
	})

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllPredictionsHandler = async (request, h) => {

	const predictions = await prisma.waterPrediction.findMany({
		where: {
			author: {
				contains: request.query.author
			},
			prediction: {
				gt: request.query["predictionGt"],
				lt: request.query["predictionLt"],
				gte: request.query["predictionGte"],
				lte: request.query["predictionLte"]
			},
			dateCreated: {
				gt: request.query['dateCreatedGt'] ? new Date(request.query['dateCreatedGt']) : undefined,
				lt: request.query['dateCreatedLt'] ? new Date(request.query['dateCreatedLt']) : undefined,
				gte: request.query['dateCreatedGte'] ? new Date(request.query['dateCreatedGte']) : undefined,
				lte: request.query['dateCreatedLte'] ? new Date(request.query['dateCreatedLte']) : undefined
			},
			authorId: request.query.authorId
		},
		skip: (request.query.page || 0) * 10,
		take: 10,
	})

	const response = h.response({
		data: predictions
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const createPredictionHandler = async (request, h) => {
	let prediction
	try {
		prediction = await prisma.waterPrediction.create({
			data: {
				"authorId": request.auth.artifacts.id,
				"imageUrl": request.payload.imageUrl,
				"prediction": request.payload.prediction,
			}
		})
	} catch (e) {
		console.error(e)
		throw e
	}

	const response = h.response({
		message: "Prediction created.",
		data: prediction
	})

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getPredictionHandler = async (request, h) => {
	const prediction = await prisma.waterPrediction.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!prediction) {
		const response = h.response({
			message: "Prediction not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: prediction
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updatePredictionHandler = async (request, h) => {

	let prediction = await prisma.waterPrediction.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!prediction) {
		const response = h.response({
			message: "Prediction not found.",
		})
		response.code(404)
		return response
	}
		
	if (prediction.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to update this prediction.",
		})
		response.code(403)
		return response
	}

	prediction = await prisma.waterPrediction.update({
		where: {
			id: request.params.id
		},
		data: {
			"imageUrl": request.payload.imageUrl,
			"prediction": request.payload.prediction,
		}
	})

	const response = h.response({
		message: "Prediction updated.",
		data: prediction
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deletePredictionHandler = async (request, h) => {
	let prediction = await prisma.waterPrediction.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!prediction) {
		const response = h.response({
			message: "Prediction not found.",
		})
		response.code(404)
		return response
	}

	if (prediction.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to delete this prediction.",
		})
		response.code(403)
		return response
	}

	prediction = await prisma.waterPrediction.delete({
		where: {
			id: request.params.id
		}
	})

	await deleteImageFromCloudStorage(prediction.imageUrl)

	const response = h.response({
		message: "Prediction deleted."
	})

	response.code(204)
	return response
}