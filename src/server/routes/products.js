import Joi from "joi"
import { createProductHandler, deleteProductHandler, getAllProductsHandler, getProductHandler, updateProductHandler } from "../handlers/products.js"

export default [
	{
		method: "GET",
		path: "/products",
		handler: getAllProductsHandler,
		options: {
			tags: ['api', 'products'],
			validate: {
				query: Joi.object({
					page: Joi.number().integer().min(0).default(0),
				}),
			}
		},
	},
	{
		method: "POST",
		path: "/products",
		handler: createProductHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'products'],
		}
	},
	{
		method: "GET",
		path: "/products/{id}",
		handler: getProductHandler,
		options: {
			tags: ['api', 'products'],
			validate: {
				params: Joi.object({
					id: Joi.string().guid().required()
				})
			}
		},
	},
	{
		method: "PATCH",
		path: "/products/{id}",
		handler: updateProductHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'products'],
			validate: {
				params: Joi.object({
					id: Joi.string().guid().required()
				})
			}
		}
	},
	{
		method: "DELETE",
		path: "/products/{id}",
		handler: deleteProductHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'products'],
			validate: {
				params: Joi.object({
					id: Joi.string().guid().required()
				})
			}
		}
	},
]
