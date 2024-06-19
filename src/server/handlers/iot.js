// eslint-disable-next-line no-unused-vars
import hapi from "@hapi/hapi"
import { db } from "../../services/firestoreConnector"

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const predictIotHandler = async (request, h) => {
    let predictionIot
    let formData = new FormData()

    formData.append("solids", request.payload.solids);
    formData.append("turbidity", request.payload.turbidity);
    formData.append("organic_carbon", request.payload.organic_carbon);
    formData.append("chloramines", request.payload.chloramines);
    formData.append("sulfate", request.payload.sulfate);
    formData.append("ph", request.payload.ph);

    const mlResponseRaw = await fetch(`${process.env.ML_API_URL}/potability-iot`, {
		method: "POST",
		body: formData
	})

    const mlResponse = await mlResponseRaw.json()

    predictionIot = mlResponse.data.prediction

    const data = {
        "solids" : request.payload.solids, 
        "turbidity" : request.payload.turbidity,
        "organic_carbon" : request.payload.organic_carbon,
        "chloramines": request.payload.chloramines,
        "sulfate": request.payload.sulfate,
        "ph": request.payload.ph,
        "authorId": request.auth.artifacts.id,
        "prediction": predictionIot,
    }

    predictionIot = await db.collection('iot-predictions').add(data);
    predictionIot = await predictionIot.get();

	const response = h.response({
		message: "Prediction successful.",
		data: {         
            id: predictionIot.id,
            ...predictionIot.data()
        }
	})

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getAllPredictionsIotHandler = async (request, h) => {
    
    const getPredictionIot = await db.collection('iot-predictions').get();

    const predictionsIot = [];
    getPredictionIot.forEach((doc) => {
        predictionsIot.push({ id: doc.id, ...doc.data() });
    });

    const response = h.response({
        data: predictionsIot
    });

    response.code(200);
    return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const createPredictionIotHandler = async (request, h) => {
    let predictionIot
	try {
        const data = {
            "solids" : request.payload.solids, 
            "turbidity" : request.payload.turbidity,
            "organic_carbon" : request.payload.organic_carbon,
            "chloramines": request.payload.chloramines,
            "sulfate": request.payload.sulfate,
            "ph": request.payload.ph,
            "authorId": request.auth.artifacts.id,
			"prediction": request.payload.prediction,
        }
        predictionIot = await db.collection('iot-predictions').add(data);
        predictionIot = await predictionIot.get();

	} catch (e) {
		console.error(e)
		throw e
	}

	const response = h.response({
		message: "Iot Prediction created.",
        data: {
            id: predictionIot.id,
            ...predictionIot.data()
        }
	})

	response.code(201)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const getPredictionIotHandler = async (request, h) => {
    const docRef = db.collection('iot-predictions').doc(request.params.id);
    const predictionIot = await docRef.get();

	if (!predictionIot.exists) {
		const response = h.response({
			message: "Prediction not found.",
		})
		response.code(404)
		return response
	}

	const response = h.response({
		data: { id: predictionIot.id, ...predictionIot.data() }
	})
	response.code(200)
	return response
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const updatePredictionIotHandler = async (request, h) => {
    try {
        const docRef = db.collection('iot-predictions').doc(request.params.id);
        const predictionIot = await docRef.get();

        if (!predictionIot.exists) {
            const response = h.response({
                message: "Prediction not found.",
            });
            response.code(404);
            return response;
        }

        const data = predictionIot.data();
        if (data.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
            const response = h.response({
                message: "You are not allowed to update this prediction.",
            });
            response.code(403);
            return response;
        }

        await docRef.update({
            "prediction": request.payload.prediction,
            "solids": request.payload.solids,
            "turbidity": request.payload.turbidity,
            "organic_carbon": request.payload.organic_carbon,
            "chloramines": request.payload.chloramines,
            "sulfate": request.payload.sulfate,
            "ph": request.payload.ph
        });

        const updatedPredictionIot = await docRef.get();

        const response = h.response({
            message: "IoT prediction updated.",
            data: updatedPredictionIot.data()
        });

        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            message: 'Error updating data please try later.',
            error: error.toString()
        });

        response.code(500);
        return response;
    }
}

/**
 * @param {hapi.Request<ReqRefDefaults>} request 
 * @param {hapi.ResponseToolkit<ReqRefDefaults>} h 
 * @returns {hapi.ResponseObject}
 */
export const deletePredictionIotHandler = async (request, h) => {
    try {
        const docRef = db.collection('iot-predictions').doc(request.params.id);
        const predictionIot = await docRef.get();

        if (!predictionIot.exists) {
            const response = h.response({
                message: "Prediction with the given ID isn't found.",
            });
            response.code(404);
            return response;
        }

        const data = predictionIot.data();
        if (data.authorId !== request.auth.artifacts.id && request.auth.artifacts.isAdmin === false) {
            const response = h.response({
                message: "You are not allowed to delete this prediction.",
            });
            response.code(403);
            return response;
        }

        await docRef.delete();

        const response = h.response({
            message: "Prediction deleted."
        });
        response.code(200); 
        return response;
    } catch (error) {
        const response = h.response({
            message: 'Error deleting data please try later.',
            error: error.toString()
        });

        response.code(500);
        return response;
    }
}