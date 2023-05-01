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
				name: 'Københavns Medie Gymnasium',
			}
		],
		skipDuplicates: true
	})

	const users = await prisma.user.findMany({})
	const orginization = await prisma.orginization.findMany({})

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

	await prisma.subject.createMany({
		data: [
			{
				name: 'Math',
				orginizationId: orginization[0].id
			},
			{
				name: 'English',
				orginizationId: orginization[0].id
			},
			{
				name: 'Physics',
				orginizationId: orginization[0].id
			},
			{
				name: 'Progamming',
				orginizationId: orginization[0].id
			},
			{
				name: 'Digital Design',
				orginizationId: orginization[0].id
			}
		],
		skipDuplicates: true
	})

	const subjects = await prisma.subject.findMany({})

	await prisma.standTemplate.createMany({
		data: [
			{
				name: 'Standard math lessons',
				subjectId: subjects[0].id,
				userId: users[0].id,
			},
			{
				name: 'Maple lessons',
				subjectId: subjects[0].id,
				userId: users[0].id,
			}
		],
		skipDuplicates: true
	})

	const templates = await prisma.standTemplate.findMany({})

	await prisma.standQuestion.createMany({
		data: [
			{
				standTemplateId: templates[0].id,
				question: 'How do you feel about todays lesson?',
			},
			{
				standTemplateId: templates[0].id,
				question: 'How do you feel about the videos we watched today?',
			},
			{
				standTemplateId: templates[0].id,
				question: 'How do you feel about the tools we used today?',
			}
		],
		skipDuplicates: true	
	})

	const questions = await prisma.standQuestion.findMany({})

	await prisma.lesson.createMany({
		data: [
			{
				id: 1,
				name: 'Lesson 1',
				userId: users[0].id,
				subjectId: subjects[0].id,
				standTemplateId: templates[0].id,
			}
		],
		skipDuplicates: true
	})

	const lessons = await prisma.lesson.findMany({})

	await prisma.questionAnwser.createMany({
		data: [
			{
				id: 1,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 2,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 3,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 4,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 5,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 6,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 7,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 8,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 9,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 10,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 11,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 12,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 13,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 14,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 15,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 16,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 17,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 18,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 19,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 20,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 21,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 22,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 23,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 24,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 25,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 26,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 27,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 28,
				questionId: questions[0].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 29,
				questionId: questions[1].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
			{
				id: 30,
				questionId: questions[2].id,
				rating: Math.round(Math.random() * 4) + 1,
				lessonId: lessons[0].id,
			},
		],
		skipDuplicates: true
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