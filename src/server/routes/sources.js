import { placeholderHandler } from "../handlers/index.js"
import { createSourceHandler, deleteSourceHandler, getAllSourcesHandler, getSourceHandler, updateSourceHandler } from "../handlers/sources.js"

export default [
	{
		method: "GET",
		path: "/sources",
		handler: getAllSourcesHandler,
	},
	{
		method: "POST",
		path: "/sources",
		handler: getSourceHandler,
	},
	{
		method: "GET",
		path: "/sources/{id}",
		handler: createSourceHandler,
	},
	{
		method: "PUT",
		path: "/sources/{id}",
		handler: updateSourceHandler,
	},
	{
		method: "DELETE",
		path: "/sources/{id}",
		handler: deleteSourceHandler,
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
