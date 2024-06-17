import { createPredictionHandler, deletePredictionHandler, getAllPredictionsHandler, getPredictionHandler, predictHandler, updatePredictionHandler } from "../handlers/predictions.js"

export default [
	{
		method: "POST",
		path: "/predict",
		handler: predictHandler,
		options: {
			payload: {
				allow: 'multipart/form-data',
				multipart: true,
				output: 'stream',
				parse: true
			},
			auth: 'simple',
			tags: ['api', 'predictions']
		}
	},
	{
		method: "GET",
		path: "/predictions",
		handler: getAllPredictionsHandler,
		options: {
			tags: ['api', 'predictions']
		},
	},
	{
		method: "POST",
		path: "/predictions",
		handler: createPredictionHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'predictions']
		}
	},
	{
		method: "GET",
		path: "/predictions/{id}",
		handler: getPredictionHandler,
		options: {
			tags: ['api', 'predictions']
		},
	},
	{
		method: "PATCH",
		path: "/predictions/{id}",
		handler: updatePredictionHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'predictions']
		}
	},
	{
		method: "DELETE",
		path: "/predictions/{id}",
		handler: deletePredictionHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'predictions']
		}
	},
]
