import { devLoginHandler, getUserHandler, loginGoogleHandler, loginHandler, registerHandler } from "../handlers/auth.js"
import { placeholderHandler } from "../handlers/index.js"

const routes = [
	{
		method: "POST",
		path: "/auth/login/google",
		handler: loginGoogleHandler,
	},
	{
		method: "GET",
		path: "/auth",
		handler: getUserHandler,
	},
	{
		method: "GET",
		path: "/users/{id}",
		handler: placeholderHandler,
	},
	{
		method: "POST",
		path: "/users/{id}",
		handler: placeholderHandler,
	},
	{
		method: "POST",
		path: "/auth/login",
		handler: loginHandler,
	},
	{
		method: "POST",
		path: "/auth/register",
		handler: registerHandler,
	},
]

if (process.env.NODE_ENV === "development") {
	routes.push({
		method: "POST",
		path: "/auth/login/dev",
		handler: devLoginHandler
	})
}

export { routes as default }