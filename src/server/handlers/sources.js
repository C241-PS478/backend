// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnect.js"
import { generateWrongParameterResponse } from "./index.js"
import { getReverseGeocode } from "../../services/googleMaps.js"


/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllSourcesHandler = async (request, h) => {

	if (request.query?.page && isNaN(request.query.page))
		return generateWrongParameterResponse(h, "page")

	// TODO add query on radius

	const predictions = await prisma.waterPrediction.findMany({
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
export const getSourceHandler = async (request, h) => {
	const prediction = await prisma.waterSource.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!prediction) {
		const response = h.response({
			message: "Source not found.",
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
export const createSourceHandler = async (request, h) => {

	const reverseGeocodeResult = getReverseGeocode(request.payload.lat, request.payload.lon)

	const source = await prisma.waterSource.create({
		data: {
			"address": {
				create: {
					"latitude": request.payload.lat,
					"longitude": request.payload.lon,
					"country": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "country").long_name,
					"province": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_1").long_name,
					"city": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_2").long_name,
					"district": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_3").long_name,
					"village": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_4").long_name,
					"address": reverseGeocodeResult.results[0].formatted_address
				}
			},
			"state": request.payload.state,
			"description": request.payload.description,
		}
	})

	const response = h.response({
		data: source
	})

	response.code(201)
	return response
}


/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateSourceHandler = async (request, h) => {

	let prediction

	const reverseGeocodeResult = getReverseGeocode(request.payload.lat, request.payload.lon)

	try {
		prediction = await prisma.waterSource.update({
			where: {
				id: request.params.id
			},
			data: {
				"address": {
					update: {
						"latitude": request.payload.lat,
						"longitude": request.payload.lon,
						"country": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "country").long_name,
						"province": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_1").long_name,
						"city": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_2").long_name,
						"district": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_3").long_name,
						"village": reverseGeocodeResult.results[0].address_components.find((component) => component.types === "administrative_area_level_4").long_name,
						"address": reverseGeocodeResult.results[0].formatted_address
					}
				},
				"state": request.payload.state,
				"description": request.payload.description,
			}
		})
	} catch (e) {
		if (e?.code === "P2025") {
			const response = h.response({
				message: "Source not found.",
			})
			response.code(404)
			return response
		}
	}

	console.log(prediction)

	const response = h.response({
		message: "Source updated.",
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
export const deleteSourceHandler = async (request, h) => {
	let prediction

	try {
		prediction = await prisma.waterSource.delete({
			where: {
				id: request.params.id
			}
		})
	} catch (e) {
		if (e?.code === "P2025") {
			const response = h.response({
				message: "Source not found.",
			})
			response.code(404)
			return response
		}
	}

	const response = h.response({
		message: "Source deleted."
	})

	response.code(204)
	return response
}