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

	await prisma.orginization.createMany({
		data: [
			{
				name: 'Kasper\'s Orginization',
			}
		],
		skipDuplicates: true
	})

	const orginization = await prisma.orginization.findMany({})
	const users = await prisma.user.findMany({})

	await prisma.orginizationUser.createMany({
		data: [
			{
				role: 'OWNER',
				userId: users[0].id,
				orginizationId: orginization[0].id
			}
		],
		skipDuplicates: true,
	})

	await prisma.orginizationUser.createMany({
		data: [
			{
				userId: users[1].id,
				orginizationId: orginization[0].id
			},
			{
				userId: users[2].id,
				orginizationId: orginization[0].id
			},
		],
		skipDuplicates: true,	
	})

	await prisma.orginizationIvite.createMany({
		data: [
			{
				userId: users[3].id,
				orginizationId: orginization[0].id
			},
			{
				userId: users[4].id,
				orginizationId: orginization[0].id
			},
			{
				userId: users[5].id,
				orginizationId: orginization[0].id
			},
			{
				userId: users[6].id,
				orginizationId: orginization[0].id
			},
			{
				userId: users[7].id,
				orginizationId: orginization[0].id
			},
		],
		skipDuplicates: true,	
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