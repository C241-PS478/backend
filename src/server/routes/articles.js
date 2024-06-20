import Joi from "joi"
import { createArticleHandler, deleteArticleHandler, getAllArticlesHandler, getArticleHandler, updateArticleHandler } from "../handlers/articles.js"

export default [
	{
		method: "GET",
		path: "/articles",
		handler: getAllArticlesHandler,
		options: {
			tags: ['api', 'articles'],
			validate: {
				query: Joi.object({
					page: Joi.number().integer().min(0).default(0),
				}),
			}
		},
	},
	{
		method: "POST",
		path: "/articles",
		handler: createArticleHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'articles'],
			validate: {
				payload: Joi.object({
					title: Joi.string().required(),
					content: Joi.string().required(),
					image: Joi.binary(),
				})
			}
		}
	},
	{
		method: "GET",
		path: "/articles/{id}",
		handler: getArticleHandler,
		options: {
			tags: ['api', 'articles'],
			validate: {
				params: Joi.object({
					id: Joi.string().guid().required()
				})
			}
		},
	},
	{
		method: "PATCH",
		path: "/articles/{id}",
		handler: updateArticleHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'articles'],
			validate: {
				params: Joi.object({
					id: Joi.string().guid().required()
				})
			}
		}
	},
	{
		method: "DELETE",
		path: "/articles/{id}",
		handler: deleteArticleHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'articles'],
			validate: {
				params: Joi.object({
					id: Joi.string().guid().required()
				}),
				payload: Joi.object({
					title: Joi.string().required(),
					content: Joi.string().required(),
					image: Joi.binary(),
				})
			}
		}
	},
]
