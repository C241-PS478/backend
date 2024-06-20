// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { prisma } from "../../services/databaseConnector.js"
import { generateWrongParameterResponse } from "./index.js"
import { getReverseGeocode } from "../../services/googleMapsApi.js"
import { db } from "../../services/firestoreConnector.js"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllSourcesHandler = async (request, h) => {

	if (request.query?.page && isNaN(request.query.page))
		return generateWrongParameterResponse(h, "page")

	// TODO add query on radius

	const sources = await prisma.waterSource.findMany({
		skip: (request.query.page || 0) * 10,
		take: 10,
		include: {
			address: true,
			author: true,
		},
	})

	sources.forEach(source => {
		delete source?.author?.password
	})

	const response = h.response({
		data: sources
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getSourceHandler = async (request, h) => {
	const source = await prisma.waterSource.findUnique({
		where: {
			id: request.params.id
		},
		include: {
			address: true,
			author: true,
		},
	})

	delete source?.author?.password

	if (!source) {
		const response = h.response({
			message: "Source not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: source
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const createSourceHandler = async (request, h) => {
	if (request.payload.predictionId && request.payload.predictionIotId) {
		const response = h.response({
			message: "You can't have both predictionId and predictionIotId.",
		})

		response.code(400)
		return response
	}

	if (request.payload.predictionIotId) {
		const docRef = db.collection('iot-predictions').doc(request.payload.predictionIotId);
		const predictionIot = await docRef.get();
	
		if (!predictionIot.exists) {
			const response = h.response({
				message: "Prediction not found.",
			})
			response.code(400)
			return response
		}	
	}

	// Made it here so it doesn't need to reverse geocode
	if (request.payload.predictionId) {
		const prediction = await prisma.waterPrediction.findUnique({
			where: {
				id: request.payload.predictionId
			}
		})

		if (!prediction) {
			const response = h.response({
				message: "Prediction not found.",
			})
			response.code(400)
			return response
		}
	}

	const reverseGeocodeResult = await getReverseGeocode(request.payload.lat, request.payload.long)

	let addressCreate = {
		create: {
			longitude: Number(request.payload.long),
			latitude: Number(request.payload.lat)
		}
	}

	for (const result of reverseGeocodeResult.results) {
		try {
			result.address_components.find
			addressCreate.create.country = result.address_components.find((component) => component.types.includes("country")).long_name
			addressCreate.create.province = result.address_components.find((component) => component.types.includes("administrative_area_level_1")).long_name
			addressCreate.create.city = result.address_components.find((component) => component.types.includes("administrative_area_level_2")).long_name
			addressCreate.create.district = result.address_components.find((component) => component.types.includes("administrative_area_level_3")).long_name
			addressCreate.create.village = result.address_components.find((component) => component.types.includes("administrative_area_level_4")).long_name
			addressCreate.create.address = result.formatted_address
			break
		} catch (e) {}
	}

	const source = await prisma.waterSource.create({
		data: {
			address: addressCreate,
			description: request.payload.description,
			author: {
				connect: {
					id: request.auth.artifacts.id
				}
			},
			prediction: {
				connect: {
					id: request.payload.predictionId
				}
			},
			predictionIotId: request.payload.predictionIotId
		},
		include: {
			address: true,
			author: true,
			prediction: true,
		},
	})

	delete source?.author?.password

	const response = h.response({
		data: source
	})

	response.code(201)
	return response
}


/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateSourceHandler = async (request, h) => {
	let source = await prisma.waterSource.findUnique({
		where: {
			id: request.params.id
		}
	})

	if (!source) {
		const response = h.response({
			message: "Source not found.",
		})
		response.code(404)
		return response
	}

	if (source.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to update this source.",
		})
		response.code(401)
		return response
	}

	let addressCreate

	if (request.payload.lat && request.payload.lon && request.payload.lat !== source.address.latitude && request.payload.lon !== source.address.longitude) {
		const reverseGeocodeResult = getReverseGeocode(request.payload.lat, request.payload.lon)

		addressCreate = {
			create: {
				longitude: Number(request.payload.long),
				latitude: Number(request.payload.lat)
			}
		}
	
		for (const result of reverseGeocodeResult.results) {
			try {
				result.address_components.find
				addressCreate.create.country = result.address_components.find((component) => component.types.includes("country")).long_name
				addressCreate.create.province = result.address_components.find((component) => component.types.includes("administrative_area_level_1")).long_name
				addressCreate.create.city = result.address_components.find((component) => component.types.includes("administrative_area_level_2")).long_name
				addressCreate.create.district = result.address_components.find((component) => component.types.includes("administrative_area_level_3")).long_name
				addressCreate.create.village = result.address_components.find((component) => component.types.includes("administrative_area_level_4")).long_name
				addressCreate.create.address = result.formatted_address
				break
			} catch (e) {}
		}
		}

	source = await prisma.waterSource.update({
		where: {
			id: request.params.id
		},
		data: {
			address: addressCreate,
			description: request.payload.description,
			dateModified: new Date().toISOString(),
		},
		include: {
			address: true,
			author: true,
		},
	})

	delete source?.author?.password

	const response = h.response({
		message: "Source updated.",
		data: source
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deleteSourceHandler = async (request, h) => {
	let source = await prisma.waterSource.findUnique({
		where: {
			id: request.params.id
		}
	})
	
	if (!source) {
		const response = h.response({
			message: "Source not found.",
		})
		response.code(404)
		return response
	}

	if (source.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
		const response = h.response({
			message: "You are not allowed to delete this source.",
		})
		response.code(403)
		return response
	}

	source = await prisma.waterSource.delete({
		where: {
			id: request.params.id
		}
	})

	const response = h.response({
		message: "Source deleted."
	})

	response.code(204)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getSourceCommentsHandler = async (request, h) => {
	if (request.query?.page && isNaN(request.query.page))
		return generateWrongParameterResponse(h, "page")

	const comments = await prisma.waterSourceComment.findMany({
		where: {
			waterSourceId: request.params.id
		},
		skip: (request.query.page || 0) * 10,
		take: 10,
		include: {
			author: true
		}
	})

	comments.forEach(comment => {
		delete comment?.author?.password
	})

	const response = h.response({
		data: comments
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const addSourceCommentHandler = async (request, h) => {
	let comment

	try {
		comment = await prisma.waterSourceComment.create({
			data: {
				waterSource: {
					connect: {
						id: request.params.id
					}
				},
				author: {
					connect: {
						id: request.auth.artifacts.id
					}
				},
				content: request.payload.content,
			},
			include: {
				author: true
			}
		})
	} catch (e) {
		if (e?.code === "P2003") {
			const response = h.response({
				message: "Source not found.",
			})
			response.code(404)
			return response
		}
	}

	delete comment?.author?.password

	const response = h.response({
		data: comment
	})

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getSourceCommentHandler = async (request, h) => {
	const comment = await prisma.waterSourceComment.findUnique({
		where: {
			id: request.params.commentId,
			waterSourceId: request.params.sourceId,
		},
		include: {
			author: true
		}
	})

	delete comment?.author?.password

	if (!comment) {
		const response = h.response({
			message: "Comment not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: comment
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updateSourceCommentHandler = async (request, h) => {
	let comment
	try {
		comment = await prisma.waterSourceComment.update({
			where: {
				id: request.params.commentId
			},
			data: {
				content: request.payload.content,
				dateModified: new Date().toISOString()
			}
		})
	} catch (e) {
		if (e?.code === "P2015") {
			const response = h.response({
				message: "Source or comment not found.",
			})
			response.code(404)
			return response
		}
	}

	const response = h.response({
		message: "Comment updated.",
		data: comment
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deleteSourceCommentHandler = async (request, h) => {
	try {
		await prisma.waterSourceComment.delete({
			where: {
				id: request.params.commentId
			}
		})
	} catch (e) {
		if (e?.code === "P2015") {
			const response = h.response({
				message: "Source or comment not found.",
			})
			response.code(404)
			return response
		}
	}

	const response = h.response({
		message: "Comment deleted."
	})

	response.code(204)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getSourceLikesHandler = async (request, h) => {
	const source = await prisma.waterSource.findUnique({
		where: {
			id: request.params.sourceId
		}
	})

	if (!source) {
		const response = h.response({
			message: "Source not found.",
		})
		response.code(404)
		return response
	}

	const likesAggregate = await prisma.waterSourcesLike.aggregate({
		where: {
			waterSourceId: request.params.sourceId
		},
		_count: {
			userId: true
		}
	})

	let isUserLiked
	if (request.auth?.artifacts?.id) {
		const userLike = await prisma.waterSourcesLike.findUnique({
			where: {
				waterSourceId_userId: {
					waterSourceId: request.params.sourceId,
					userId: request.auth.artifacts.id
				}
			}
		})
		isUserLiked = !!userLike
	}

	const response = h.response({
		data: {
			isUserLiked: isUserLiked,
			numLikes: likesAggregate._count.userId
		}
	})

	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const likeSourceHandler = async (request, h) => {
	let like = await prisma.waterSourcesLike.findUnique({
		where: {
			waterSourceId_userId: {
				waterSourceId: request.params.sourceId,
				userId: request.auth.artifacts.id
			}
		}
	})

	if (like) {
		const response = h.response({
			message: "Source already liked.",
		})
		response.code(201)
		return response
	}

	try {
		like = await prisma.waterSourcesLike.create({
			data: {
				waterSource: {
					connect: {
						id: request.params.sourceId
					}
				},
				user: {
					connect: {
						id: request.auth.artifacts.id
					}
				}
			}
		})
	} catch (e) {
		if (e?.code === "P2003") {
			const response = h.response({
				message: "Source not found.",
			})
			response.code(404)
			return response
		}
	}

	const response = h.response({
		"message": "Source liked."
	})

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const unlikeSourceHandler = async (request, h) => {
	try {
		await prisma.waterSourcesLike.delete({
			where: {
				waterSourceId_userId: {
					waterSourceId: request.params.id,
					userId: request.auth.artifacts.id
				}
			}
		})
	} catch (e) {
		if (e?.code === "P2003") {
			const response = h.response({
				message: "Source not found.",
			})
			response.code(404)
			return response
		}
	}

	const response = h.response({
		"message": "Source unliked."
	})

	response.code(204)
	return response
}