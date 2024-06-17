import { Storage } from '@google-cloud/storage'

const storage = new Storage()

const bucketName = process.env.GCS_BUCKET

export const uploadBufferToCloudStorage = async (buffer, filePath) => {
	await storage.bucket(bucketName).file(filePath).save(buffer)

	return `https://storage.googleapis.com/${bucketName}/${filePath}`
}

export const deleteFileFromCloudStorage = async url => {
	if (!url) {
		throw new Error('URL is required')
	}
	
	const urlSplitted = url.split('/')

	if (!urlSplitted.length < 5) {
		throw new Error('Invalid URL')
	}
	const destinationFilePath = urlSplitted.slice(4).join('/')
	const bucketName = urlSplitted[3]

	await storage.bucket(bucketName).file(`prediction-images/${destinationFilePath}`).delete()
}