import { createPredictionIotHandler, deletePredictionIotHandler, getAllPredictionsIotHandler, getPredictionIotHandler, predictIotHandler, updatePredictionIotHandler } from "../handlers/iot.js";


export default [
    {
		method: "POST",
		path: "/predict/iot",
		handler: predictIotHandler,
		options: {
			payload: {
				allow: 'multipart/form-data',
				multipart: true,
				output: 'stream',
				parse: true
			},
			auth: 'simple',
			tags: ['api', 'iot']
		}
	},
    {
		method: "POST",
		path: "/predictions/iot",
		handler: createPredictionIotHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'iot']
		}
	},
	{
		method: "GET",
		path: "/predictions/iot",
		handler: getAllPredictionsIotHandler,
		options: {
			tags: ['api', 'iot']
		},
	},
	{
		method: "GET",
		path: "/predictions/iot/{id}",
		handler: getPredictionIotHandler,
		options: {
			tags: ['api', 'iot']
		},
	},
    {
		method: "PATCH",
		path: "/predictions/iot/{id}",
		handler: updatePredictionIotHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'iot']
		}
	},
	{
		method: "DELETE",
		path: "/predictions/iot/{id}",
		handler: deletePredictionIotHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'iot']
		}
	},
]