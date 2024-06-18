import admin from 'firebase-admin'
import { prisma } from './databaseConnector.js'
import { UserRecord } from 'firebase-admin/auth'
import { getPotentialUsername } from './localUserService.js'
import { sanitizeUser } from '../utils/auth.js'

admin.initializeApp()

export const getFirebaseUserRecord = async token => {
	const decodedToken = await admin.auth().verifyIdToken(token)

	const userId = decodedToken.uid

	const user = await admin.auth().getUser(userId)

	return user
}

export const getFirebaseUserLocalInfo = async token => {
	const firebaseUserRecord = await getFirebaseUserRecord(token)
	console.log("firebaseUserRecord", firebaseUserRecord)
	const user = await prisma.user.findFirst({
		where: {
			firebaseId: firebaseUserRecord.uid
		}
	})

	if (user) {
		return sanitizeUser(user)
	} else {
		return await addFirebaseUserToDatabase(firebaseUserRecord)
	}
}

/**
 * @param {UserRecord} firebaseUserRecord 
 */
export const addFirebaseUserToDatabase = async firebaseUserRecord => {

	let email
	
	const googleProviderData = firebaseUserRecord.providerData.find(provider => provider.providerId === 'google.com')
	if (googleProviderData) {
		email = googleProviderData.email
	} else {
		email = firebaseUserRecord.providerData[0].email
	}

	let potentialUsername = await getPotentialUsername(email.split('@')[0])
	
	const newUser = await prisma.user.create({
		data: {
			firebaseId: firebaseUserRecord.uid,
			email: email,
			name: firebaseUserRecord.displayName,
			username: potentialUsername,
		}
	})

	return newUser
}