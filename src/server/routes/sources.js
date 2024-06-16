import { placeholderHandler } from "../handlers/index.js"
import { addSourceCommentHandler, createSourceHandler, deleteSourceCommentHandler, deleteSourceHandler, getAllSourcesHandler, getSourceCommentHandler, getSourceCommentsHandler, getSourceHandler, getSourceLikesHandler, likeSourceHandler, unlikeSourceHandler, updateSourceCommentHandler, updateSourceHandler } from "../handlers/sources.js"

export default [
	{
		method: "GET",
		path: "/sources",
		handler: getAllSourcesHandler,
	},
	{
		method: "POST",
		path: "/sources",
		handler: createSourceHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/sources/{id}",
		handler: getSourceHandler,
	},
	{
		method: "PATCH",
		path: "/sources/{id}",
		handler: updateSourceHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "DELETE",
		path: "/sources/{id}",
		handler: deleteSourceHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/sources/{id}/comments",
		handler: getSourceCommentsHandler,
	},
	{
		method: "POST",
		path: "/sources/{id}/comments",
		handler: addSourceCommentHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/sources/{sourceId}/comments/{commentId}",
		handler: getSourceCommentHandler,
	},
	{
		method: "PATCH",
		path: "/sources/{sourceId}/comments/{commentId}",
		handler: updateSourceCommentHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "DELETE",
		path: "/sources/{sourceId}/comments/{commentId}",
		handler: deleteSourceCommentHandler,
		options: {
			auth: 'simple'
		}
	},
	
	{
		method: "GET",
		path: "/sources/{sourceId}/like",
		handler: getSourceLikesHandler,
		options: {
			auth: 'optional'
		}
	},
	{
		method: "POST",
		path: "/sources/{sourceId}/like",
		handler: likeSourceHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "DELETE",
		path: "/sources/{sourceId}/like",
		handler: unlikeSourceHandler,
		options: {
			auth: 'simple'
		}
	},
]
