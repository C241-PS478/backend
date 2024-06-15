import { Storage } from '@google-cloud/storage'
import { fileTypeFromBuffer } from 'file-type'

const storage = new Storage()

/**
 * @returns {string}
 */
function generateFileName() {
	const timestamp = Date.now()
	return `${timestamp}`
}

/**
 * @param {Buffer} buffer 
 * @returns {string}
 */
const getFileType = buffer => {
	const type = fileTypeFromBuffer(buffer)
	return type ? type.ext : 'unknown'
}

const bucketName = 'waterwise'

export const uploadBufferToCloudStorage = async (buffer, pathPrefix) => {
	const fileName = generateFileName()
	const fileType = getFileType(buffer)

	const destinationFilePath = `${pathPrefix}${fileName}.${fileType}`

	await storage.bucket(bucketName).file(destinationFilePath).save(buffer)

	return `https://storage.googleapis.com/${bucketName}/${destinationFilePath}`
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