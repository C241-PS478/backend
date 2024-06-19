import { Storage } from '@google-cloud/storage'

const storage = new Storage()

const bucketName = process.env.GCS_BUCKET

export const uploadBufferToCloudStorage = async (buffer, filePath) => {
	await storage.bucket(bucketName).file(filePath).save(buffer)

	return `https://storage.googleapis.com/${bucketName}/${filePath}`
}

export const deleteFileFromCloudStorage = async url => {
	if (!url) {
		return
	}

	if (!url.startsWith(`https://storage.googleapis.com/${bucketName}`)) {
		return
	}
	
	const filePath = url.replace(`https://storage.googleapis.com/${bucketName}/`, '')

	await storage.bucket(bucketName).file(filePath).delete()
}