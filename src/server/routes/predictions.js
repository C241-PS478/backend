import { createPredictionHandler, deletePredictionHandler, getAllPredictionsHandler, getPredictionHandler, predictHandler, updatePredictionHandler } from "../handlers/predictions.js"

export default [
	{
		method: "POST",
		path: "/predict",
		handler: predictHandler,
		options: {
			payload: {
				allow: 'multipart/form-data',
				multipart: true
			},
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/predictions",
		handler: getAllPredictionsHandler,
	},
	{
		method: "POST",
		path: "/predictions",
		handler: createPredictionHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/predictions/{id}",
		handler: getPredictionHandler,
	},
	{
		method: "PATCH",
		path: "/predictions/{id}",
		handler: updatePredictionHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "DELETE",
		path: "/predictions/{id}",
		handler: deletePredictionHandler,
		options: {
			auth: 'simple'
		}
	},
]
