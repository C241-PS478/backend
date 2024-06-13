// https://www.prisma.io/docs/getting-started/quickstart

import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

// import { PrismaClient as PrismaClientSqlite } from '../../prisma/generated/sqlite'
// import { PrismaClient as PrismaClientPostgres } from '../../prisma/generated/postgres'

// export let prisma

// if (process.env.DATABASE_URL.endsWith(".db")) prisma = new PrismaClientSqlite() 
// prisma = new PrismaClientPostgres()

// async function main() {
// 	const user = await prisma.user.create({
// 		data: {
// 			name: "Alice",
// 			email: "alice@prisma.io",
// 		},
// 	})
// 	console.log(user)
// }

// main()
// 	.then(async () => {
// 		await prisma.$disconnect()
// 	})
// 	.catch(async (e) => {
// 		console.error(e)
// 		await prisma.$disconnect()
// 		process.exit(1)
// 	})