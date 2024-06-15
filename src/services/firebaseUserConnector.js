import admin from 'firebase-admin'
import { prisma } from './databaseConnector.js'
import { UserRecord } from 'firebase-admin/auth'
import { getPotentialUsername } from './localUserService.js'

admin.initializeApp()

export const getFirebaseUserRecord = async token => {
	const decodedToken = await admin.auth().verifyIdToken(token)

	const userId = decodedToken.uid

	const user = await admin.auth().getUser(userId)

	return user
}

export const getFirebaseUserLocalInfo = async token => {
	const firebaseUserRecord = await getFirebaseUserRecord(token)

	try {
		const user = await prisma.user.findUnique({
			where: {
				uid: firebaseUserRecord.uid
			}
		})

		return user
	} catch (e) {
		if (e?.code === "P2025") {
			return await addFirebaseUserToDatabase(firebaseUserRecord)
		}
		throw e
	}
}

/**
 * @param {UserRecord} firebaseUserRecord 
 */
export const addFirebaseUserToDatabase = async firebaseUserRecord => {
	let potentialUsername = await getPotentialUsername(firebaseUserRecord.email.split('@')[0])
	
	const newUser = await prisma.user.create({
		data: {
			firebaseId: firebaseUserRecord.uid,
			email: firebaseUserRecord.email,
			name: firebaseUserRecord.displayName,
			username: potentialUsername,
		}
	})

	return newUser
}