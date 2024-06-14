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
			}
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
	},
	{
		method: "GET",
		path: "/predictions/{id}",
		handler: getPredictionHandler,
	},
	{
		method: "PUT",
		path: "/predictions/{id}",
		handler: updatePredictionHandler,
	},
	{
		method: "DELETE",
		path: "/predictions/{id}",
		handler: deletePredictionHandler,
	},
]
