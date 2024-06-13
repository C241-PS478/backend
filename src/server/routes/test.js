import { helloTestHandler, createUserHandler, getAllUserHandler, deleteAllUserHandler } from "../handlers/test.js"

export default [
	{
		method: "GET",
		path: "/dev",
		handler: helloTestHandler,
	},
	{
		method: "POST",
		path: "/dev/user",
		handler: createUserHandler,
	},
	{
		method: "GET",
		path: "/dev/user",
		handler: getAllUserHandler,
	},
	{
		method: "DELETE",
		path: "/dev/user",
		handler: deleteAllUserHandler,
	}
]
