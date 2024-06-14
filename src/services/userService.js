import admin from 'firebase-admin'
import { prisma } from './databaseConnect'

admin.initializeApp()

export const getFirebaseUserRecord = async token => {
	try {
		const decodedToken = await admin.auth().verifyIdToken(token)

		const userId = decodedToken.uid

		const user = await admin.auth().getUser(userId)

		return user
	} catch (error) {
		console.error('Error retrieving user information:', error)
		throw error
	}
}

export const getDatabaseUserInfo = async token => {
	const firebaseUserDetails = await getFirebaseUserRecord(token)

	try {
		const user = await prisma.user.findUnique({
			where: {
				uid: firebaseUserDetails.uid
			}
		})

		return user
	} catch (e) {
		if (e?.code === "P2025") {
			let potentialUsername = firebaseUserDetails.email.split('@')[0]
			let initialPotentialUsername = potentialUsername
			let usernameSuffix = 1
			while (true) {
				const foundUsers = await prisma.user.findMany({
					where: {
						username: potentialUsername
					}
				})
				if (foundUsers.length === 0) {
					break
				}
				potentialUsername = initialPotentialUsername + usernameSuffix
			}
			const newUser = await prisma.user.create({
				data: {
					firebaseId: firebaseUserDetails.uid,
					email: firebaseUserDetails.email,
					name: firebaseUserDetails.displayName,
					username: potentialUsername,
				}
			})
			return newUser
		}
		throw e
	}
}