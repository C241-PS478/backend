import { placeholderHandler } from "../handlers/index.js"

export default [
	{
		method: "POST",
		path: "/predict",
		handler: placeholderHandler,
	},
	{
		method: "GET",
		path: "/predictions",
		handler: placeholderHandler,
	},
	{
		method: "POST",
		path: "/predictions",
		handler: placeholderHandler,
	},
	{
		method: "GET",
		path: "/predictions/{id}",
		handler: placeholderHandler,
	},
	{
		method: "PUT",
		path: "/predictions/{id}",
		handler: placeholderHandler,
	},
	{
		method: "DELETE",
		path: "/predictions/{id}",
		handler: placeholderHandler,
	},
]
