import { createPredictionHandler, deletePredictionHandler, getAllPredictionsHandler, getPredictionHandler, predictHandler, updatePredictionHandler } from "../handlers/predictions.js"
import Joi from "joi"

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
			tags: ['api', 'predictions'],
			validate: {
				query: Joi.object({
					page: Joi.number().integer().min(0).default(0),
					predictionGt: Joi.number().integer().min(0),
					predictionLt: Joi.number().integer().max(1),
					predictionGte: Joi.number().integer().min(0),
					predictionLte: Joi.number().integer().max(1),
					dateCreatedGt: Joi.date().iso(),
					dateCreatedLt: Joi.date().iso(),
					dateCreatedGte: Joi.date().iso(),
					dateCreatedLte: Joi.date().iso(),
					authorId: Joi.string().guid(),
				}),
			}
		},
	},
	{
		method: "POST",
		path: "/predictions",
		handler: createPredictionHandler,
		options: {
			payload: {
				allow: 'multipart/form-data',
				multipart: true,
				output: 'stream',
				parse: true
			},
			auth: 'simple',
			tags: ['api', 'predictions'],
			validate: {
				payload: Joi.object({
					image: Joi.binary(),
					imageUrl: Joi.string(),
					prediction: Joi.number().required(),
				})
			}
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
			payload: {
				allow: 'multipart/form-data',
				multipart: true,
				output: 'stream',
				parse: true
			},
			auth: 'simple',
			tags: ['api', 'predictions'],
			validate: {
				payload: Joi.object({
					image: Joi.binary(),
					imageUrl: Joi.string(),
					prediction: Joi.number(),
				})
			}
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
