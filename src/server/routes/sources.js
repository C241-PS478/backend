import { addSourceCommentHandler, createSourceHandler, deleteSourceCommentHandler, deleteSourceHandler, getAllSourcesHandler, getSourceCommentHandler, getSourceCommentsHandler, getSourceHandler, getSourceLikesHandler, likeSourceHandler, unlikeSourceHandler, updateSourceCommentHandler, updateSourceHandler } from "../handlers/sources.js"

export default [
	{
		method: "GET",
		path: "/sources",
		handler: getAllSourcesHandler,
		options: {
			tags: ['api', 'sources']
		},
	},
	{
		method: "POST",
		path: "/sources",
		handler: createSourceHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	{
		method: "GET",
		path: "/sources/{id}",
		handler: getSourceHandler,
		options: {
			tags: ['api', 'sources'],
			tags: ['api', 'sources']
		},
	},
	{
		method: "PATCH",
		path: "/sources/{id}",
		handler: updateSourceHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	{
		method: "DELETE",
		path: "/sources/{id}",
		handler: deleteSourceHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	{
		method: "GET",
		path: "/sources/{id}/comments",
		handler: getSourceCommentsHandler,
		options: {
			tags: ['api', 'sources']
		},
	},
	{
		method: "POST",
		path: "/sources/{id}/comments",
		handler: addSourceCommentHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	{
		method: "GET",
		path: "/sources/{sourceId}/comments/{commentId}",
		handler: getSourceCommentHandler,
		options: {
			tags: ['api', 'sources']
		},
	},
	{
		method: "PATCH",
		path: "/sources/{sourceId}/comments/{commentId}",
		handler: updateSourceCommentHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	{
		method: "DELETE",
		path: "/sources/{sourceId}/comments/{commentId}",
		handler: deleteSourceCommentHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	
	{
		method: "GET",
		path: "/sources/{sourceId}/like",
		handler: getSourceLikesHandler,
		options: {
			auth: 'optional',
			tags: ['api', 'sources']
		}
	},
	{
		method: "POST",
		path: "/sources/{sourceId}/like",
		handler: likeSourceHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
	{
		method: "DELETE",
		path: "/sources/{sourceId}/like",
		handler: unlikeSourceHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'sources']
		}
	},
]
