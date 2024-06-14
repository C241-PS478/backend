/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const copyThisTemplateHandler = (request, h) => {
	const response = h.response({
		message: "Your message here!",
		data: {
			"key": "value"
		}
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const indexHandler = (request, h) => {
	const response = h.response({
		message: "WaterWise Main Backend API",
		data: {
			date: new Date().toISOString(),
		}
	})

	response.code(404)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const placeholderHandler = (request, h) => {
	const response = h.response({
		message: "To be implemented.",
	})

	response.code(404)
	return response
}

export const generateWrongParameterResponse = (h, parameter) => {
	const response = h.response({
		message: `Wrong parameter value: ${parameter}`,
	})

	response.code(400)
	return response
}

export const generateInternalServerErrorResponse = (h, details, error) => {
	const response = h.response({
		message: `${details || "Something went wrong behind here."} Please report or try again later.`,
		error: error
	})

	response.code(500)
	return response
}