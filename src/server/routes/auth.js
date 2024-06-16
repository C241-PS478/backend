import { devLoginHandler, getOwnUserHandler, getUserHandler, loginGoogleHandler, loginHandler, registerHandler, updateOwnUserHandler, updateUserHandler } from "../handlers/auth.js"

const routes = [
	{
		method: "POST",
		path: "/auth/register",
		handler: registerHandler,
	},
	{
		method: "POST",
		path: "/auth/login",
		handler: loginHandler,
	},
	{
		method: "POST",
		path: "/auth/login/google",
		handler: loginGoogleHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/auth",
		handler: getOwnUserHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "PATCH",
		path: "/auth",
		handler: updateOwnUserHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "GET",
		path: "/users/{id}",
		handler: getUserHandler,
		options: {
			auth: 'simple'
		}
	},
	{
		method: "PATCH",
		path: "/users/{id}",
		handler: updateUserHandler,
		options: {
			auth: 'simple'
		}
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