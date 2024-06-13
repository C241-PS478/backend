import { placeholderHandler } from "../handlers/index.js"

export default [
	{
		method: "GET",
		path: "/sources",
		handler: placeholderHandler,
	},
	{
		method: "POST",
		path: "/sources",
		handler: placeholderHandler,
	},
	{
		method: "GET",
		path: "/sources/{id}",
		handler: placeholderHandler,
	},
	{
		method: "PUT",
		path: "/sources/{id}",
		handler: placeholderHandler,
	},
	{
		method: "DELETE",
		path: "/sources/{id}",
		handler: placeholderHandler,
	},
	{
		method: "GET",
		path: "/sources/{id}/comments",
		handler: placeholderHandler,
	},
	{
		method: "POST",
		path: "/sources/{id}/comments",
		handler: placeholderHandler,
	},
	{
		method: "GET",
		path: "/sources/{source_id}/comments/{comment_id}",
		handler: placeholderHandler,
	},
	{
		method: "PUT",
		path: "/sources/{source_id}/comments/{comment_id}",
		handler: placeholderHandler,
	},
	{
		method: "DELETE",
		path: "/sources/{source_id}/comments/{comment_id}",
		handler: placeholderHandler,
	},
	{
		method: "POST",
		path: "/sources/{source_id}/like",
		handler: placeholderHandler,
	},
	{
		method: "DELETE",
		path: "/sources/{source_id}/like",
		handler: placeholderHandler,
	},
]
