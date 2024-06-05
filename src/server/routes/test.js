import { helloTestHandler } from "../handlers/test.js"

export default [
	{
		method: "GET",
		path: "/test",
		handler: helloTestHandler,
	}
]
