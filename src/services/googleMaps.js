import { Client } from "@googlemaps/google-maps-services-js"

const client = new Client({})

export const getReverseGeocode = async (lat, lng) => {
	const response = await client.reverseGeocode({
		params: {
			latlng: `${lat},${lng}`,
			key: process.env.GEOCODING_API_KEY
		}
	})

	return response.data
}
