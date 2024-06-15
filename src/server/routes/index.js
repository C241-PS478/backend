import { indexHandler } from "../handlers/index.js"
import predictions from "./predictions.js"
import test from "./test.js"
import auth from "./auth.js"

export default [
	{
		method: "GET",
		path: "/",
		handler: indexHandler,
	},
	...auth,
	...test,
	...predictions,
]