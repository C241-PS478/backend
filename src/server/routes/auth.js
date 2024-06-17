import { joiAuthorizationHeader } from "../../utils/joiTypes.js"
import { devLoginHandler, getOwnUserHandler, getUserHandler, loginGoogleHandler, loginHandler, registerHandler, updateOwnUserHandler, updateUserHandler } from "../handlers/auth.js"
import Joi from "joi"

// const exampleUser = {
// 	"id": "336fa0a8-1d24-4241-805e-2dc50d6250f5",
// 	"firebaseId": null,
// 	"username": "docs-test",
// 	"email": "docs-test@waterwise.bangkit.academy",
// 	"name": "docs-test",
// 	"isAdmin": false,
// 	"phoneNumber": ""
// }

const exampleToken = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjMzNmZhMGE4LTFkMjQtNDI0MS04MDVlLTJkYzUwZDYyNTBmNSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MTg2MDQ2MTIsImlzcyI6InVybjp3YXRlcndpc2U6YXV0aCIsImF1ZCI6InVybjp3YXRlcndpc2U6dXNlciIsImV4cCI6MTc1MDE2MjIxMn0.luKHt-8xTQgpmtTfmAeiOrCcp8_5p5Y82NVgB4MWtNs"

const joiUserData = Joi.object({
	"id": Joi.string().required().example("336fa0a8-1d24-4241-805e-2dc50d6250f5").description("User ID"),
}).unknown(true).required()

const joiAuthenticationData = Joi.object({
	user: joiUserData,
	token: Joi.string().required().example(exampleToken).description("JWT token for authentication")
}).required()

const routes = [
	{
		method: "POST",
		path: "/auth/register",
		handler: registerHandler,
		options: {
			tags: ['api', 'auth'],
			description: "Register",
			notes: "Register a new user.",
			validate: {
				payload: Joi.object({
					username: Joi.string().required().description("Username"),
					password: Joi.string().required().description("Password"),
					name: Joi.string().required().description("Name"),
					email: Joi.string().email().required().description("Email"),
				})
			},
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required().example("Registration successful."),
						data: joiAuthenticationData
					}).required(),
					400: Joi.object({
						message: Joi.string().required().example("Username already taken.")
					}).required()
				}
			}
		},
	},
	{
		method: "POST",
		path: "/auth/login",
		handler: loginHandler,
		options: {
			tags: ['api', 'auth'],
			description: "Login",
			notes: "Login with username and password.",
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required().example("Login successful."),
						data: joiAuthenticationData
					}).required(),
					400: Joi.object({
						message: Joi.string().required().example("Invalid username or password.")
					}).required()
				}
			}
		},
	},
	{
		method: "POST",
		path: "/auth/login/google",
		handler: loginGoogleHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'auth'],
			description: "Login (Google)",
			notes: "Login with a Google account via Firebase Authentication. If the user does not exist, a new user will be created with the Google account's information",
			validate: {
				headers: joiAuthorizationHeader("Firebase Authentication token in form of a bearer token.")
			},
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required().example("Login successful."),
						data: joiAuthenticationData
					}).required(),
					400: Joi.object({
						message: Joi.string().required()
					}).required()
				}
			}
		},
	},
	{
		method: "GET",
		path: "/auth",
		handler: getOwnUserHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'auth'],
			description: "Get own user information",
			notes: "Get the user information of the currently authenticated user.",
			validate: {
				headers: joiAuthorizationHeader()
			},
			response: {
				status: {
					200: Joi.object({
						data: joiUserData
					}).required()
				}
			}
		},
	},
	{
		method: "PATCH",
		path: "/auth",
		handler: updateOwnUserHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'auth'],
			description: "Update own user information",
			notes: "Update the user information of the currently authenticated user.",
			validate: {
				headers: joiAuthorizationHeader(),
				payload: Joi.object({
					username: Joi.string().required().description("Username"),
					password: Joi.string().required().description("Password"),
					name: Joi.string().required().description("Name"),
					email: Joi.string().email().required().description("Email"),
					phoneNumber: Joi.string().allow("").required().description("Phone number"),
				})
			},
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required().example("User updated."),
						data: joiUserData
					}).required(),
					400: Joi.object({
						message: Joi.string().required()
					}).required()
				}
			}
		},
	},
	{
		method: "GET",
		path: "/users/{id}",
		handler: getUserHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'auth'],
			description: "Get user information",
			notes: "Get the user information of a user by ID.",
			validate: {
				headers: joiAuthorizationHeader(),
				params: Joi.object({
					id: Joi.string().required().example("336fa0a8-1d24-4241-805e-2dc50d6250f5").description("User ID")
				}),
			},
			response: {
				status: {
					200: Joi.object({
						data: joiUserData
					}).required(),
					403: Joi.object({
						message: Joi.string().required().example("You are not allowed to view this user.")
					}).required(),
					404: Joi.object({
						message: Joi.string().required().example("User not found.")
					}).required()
				}
			}
		},
	},
	{
		method: "PATCH",
		path: "/users/{id}",
		handler: updateUserHandler,
		options: {
			auth: 'simple',
			tags: ['api', 'auth'],
			description: "Update user information",
			notes: "Update the user information of a user by ID.",
			validate: {
				headers: joiAuthorizationHeader(),
				params: Joi.object({
					id: Joi.string().required().example("336fa0a8-1d24-4241-805e-2dc50d6250f5").description("User ID")
				}),
				payload: Joi.object({
					username: Joi.string().required(),
					password: Joi.string().required(),
					name: Joi.string().required(),
					email: Joi.string().email().required(),
					phoneNumber: Joi.string().allow("").required(),
				})
			},
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required().example("User updated."),
						data: joiUserData
					}).required(),
					403: Joi.object({
						message: Joi.string().required().example("You are not allowed to update this user.")
					}).required(),
					404: Joi.object({
						message: Joi.string().required().example("User not found.")
					}).required()
				}
			}
		},
	},
]

if (process.env.NODE_ENV === "development") {
	routes.push({
		method: "POST",
		path: "/auth/login/dev",
		handler: devLoginHandler,
		options: {
			tags: ['api', 'auth'],
			description: "Login (Development)",
			notes: "Login with a development account.",
			response: {
				status: {
					200: Joi.object({
						message: Joi.string().required().example("Login successful."),
						data: joiAuthenticationData
					}).required()
				}
			}
		},
	})
}

export { routes as default }