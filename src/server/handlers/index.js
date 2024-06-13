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