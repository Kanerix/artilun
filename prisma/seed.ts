import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
	const salt = await bcrypt.genSalt(10)
	await prisma.user.createMany({
		data: [
			{
				email: 'kasper@mail.com',
				firstName: 'Kasper',
				lastName: 'Jønsson',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'karl@mail.com',
				firstName: 'Karl',
				lastName: 'Ruby',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'lukas@mail.com',
				firstName: 'Lukas',
				lastName: 'Shaghashvilli',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'john@mail.com',
				firstName: 'John',
				lastName: 'Terry',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'michael@mail.com',
				firstName: 'Michael',
				lastName: 'Uhre',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'mohammed@mail.com',
				firstName: 'Mohammed',
				lastName: 'Salah',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'virgil@mail.com',
				firstName: 'Virgil',
				lastName: 'van Dijk',
				password: await bcrypt.hash('password', salt),
			},
			{
				email: 'jesper@mail.com',
				firstName: 'Jesper',
				lastName: 'Lindstrøm',
				password: await bcrypt.hash('password', salt),
			},
		],
		skipDuplicates: true,
	})

	const users = await prisma.user.findMany({})

	const orginizationUser = await prisma.orginizationUser.create({
		data: {
			role: 'OWNER',
			user: {
				connect: {
					id: users[0].id
				}	
			},
			orginization: {
				create: {
					name: 'Københavns Medie Gymnasium'
				}
			}
		},
	})

	await prisma.orginizationUser.createMany({
		data: [
			{
				userId: users[1].id,
				orginizationId: orginizationUser.orginizationId
			},
			{
				userId: users[2].id,
				orginizationId: orginizationUser.orginizationId
			},
		]
	})

	await prisma.orginizationIvite.createMany({
		data: [
			{
				userId: users[3].id,
				orginizationId: orginizationUser.orginizationId
			},
			{
				userId: users[4].id,
				orginizationId: orginizationUser.orginizationId
			},
			{
				userId: users[5].id,
				orginizationId: orginizationUser.orginizationId
			},
			{
				userId: users[6].id,
				orginizationId: orginizationUser.orginizationId
			},
			{
				userId: users[7].id,
				orginizationId: orginizationUser.orginizationId
			},
		]
	})
}


main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})