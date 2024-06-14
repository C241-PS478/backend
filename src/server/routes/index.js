import { indexHandler } from "../handlers/index.js"
import predictions from "./predictions.js"
import test from "./test.js"

export default [
	{
		method: "GET",
		path: "/",
		handler: indexHandler,
	},

	...test,
	...predictions,
]