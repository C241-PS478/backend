// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnect.js"
import { generateWrongParameterResponse } from "./index.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const predictHandler = async (request, h) => {
	console.log(request.payload)

	const image = request.payload.image

	if (!image) {
		const response = h.response({
			message: "No image supplied.",
		})
		response.code(400)
		return response
	}

	// TODO save image to GCS

	// TODO move this to services folder
	let formData = new FormData()
	formData.append('image', new Blob([image]))

	const mlResponse = await fetch(`${process.env.ML_API_URL}/clean-water`, {
		method: "POST",
		body: formData
	}).then(res => res.json())

	const prediction = mlResponse.data.prediction

	const predictionData = await prisma.waterPrediction.create({
		data: {
			// "author": "", // TODO
			"imageUrl": "", // TODO get image url from GCS
			"prediction": prediction
		}
	})

	const response = h.response({
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

	if (request.query?.page && isNaN(request.query.page))
		return generateWrongParameterResponse(h, "page")
	if (request.query?.["predictionGt"] && isNaN(request.query["predictionGt"]))
		return generateWrongParameterResponse(h, "predictionGt")
	if (request.query?.["predictionLt"] && isNaN(request.query["predictionLt"]))
		return generateWrongParameterResponse(h, "predictionLt")
	if (request.query?.["predictionGte"] && isNaN(request.query["predictionGte"]))
		return generateWrongParameterResponse(h, "predictionGte")
	if (request.query?.["predictionLte"] && isNaN(request.query["predictionLte"]))
		return generateWrongParameterResponse(h, "predictionLte")
	if (request.query?.["dateCreatedGt"] && isNaN(request.query["dateCreatedGt"]))
		return generateWrongParameterResponse(h, "dateCreatedGt")
	if (request.query?.["dateCreatedLt"] && isNaN(request.query["dateCreatedLt"]))
		return generateWrongParameterResponse(h, "dateCreatedLt")
	if (request.query?.["dateCreatedGte"] && isNaN(request.query["dateCreatedGte"]))
		return generateWrongParameterResponse(h, "dateCreatedGte")
	if (request.query?.["dateCreatedLte"] && isNaN(request.query["dateCreatedLte"]))
		return generateWrongParameterResponse(h, "dateCreatedLte")

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
				// "author": "", // TODO
				"imageUrl": request.payload.imageUrl,
				"prediction": request.payload.prediction
			}
		})
	} catch (e) {
		console.error(e)
	}

	const response = h.response({
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

	let prediction

	try {
		prediction = await prisma.waterPrediction.update({
			where: {
				id: request.params.id
			},
			data: {
				"imageUrl": request.payload.imageUrl,
				"prediction": request.payload.prediction
			}
		})
	} catch (e) {
		if (e?.code === "P2025") {
			const response = h.response({
				message: "Prediction not found.",
			})
			response.code(404)
			return response
		}
	}

	console.log(prediction)

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
	let prediction

	try {
		prediction = await prisma.waterPrediction.delete({
			where: {
				id: request.params.id
			}
		})
	} catch (e) {
		if (e?.code === "P2025") {
			const response = h.response({
				message: "Prediction not found.",
			})
			response.code(404)
			return response
		}
	}

	const response = h.response({
		message: "Prediction deleted."
	})

	response.code(204)
	return response
}