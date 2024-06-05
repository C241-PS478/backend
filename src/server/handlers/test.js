export const helloTestHandler = (request, h) => {
	const response = h.response({
		message: "Hello world!",
	})
  
	response.code(200)
	return response
}
  