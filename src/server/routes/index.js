import { indexHandler } from "../handlers/index.js"
import predictions from "./predictions.js"
import test from "./test.js"
import auth from "./auth.js"
import sources from "./sources.js"
import iot from "./iot.js"
import products from "./products.js"

export default [
	{
		method: "GET",
		path: "/",
		handler: indexHandler,
		options: {
			tags: ['api', 'index'],
			description: "Index",
		}
	},
	...auth,
	...test,
	...predictions,
	...sources,
	...iot,
	...products
]
