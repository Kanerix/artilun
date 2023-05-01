import { z } from  'zod'
import { Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'

const anwserQuestionSchema = z.object({
	questionId: z.number().positive(),
	lessonId: z.number().positive(),
	rating: z.number().min(1).max(5),
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = anwserQuestionSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user

	try {
		const [lesson, question] = await prisma.$transaction([
			prisma.lesson.findFirst({
				where: {
					id: result.data.lessonId,
				},
				select: {
					id: true,
					user: {
						select: {
							id: true
						}
					},
				}
			}),
			prisma.standQuestion.findFirst({
				where: {
					id: result.data.questionId,
				},
				select: {
					id: true,
					standTemplate: {
						select: {
							user: {
								select: {
									id: true
								}
							}
						}
					}
				}
			})
		])

		if (!lesson) {
			throw error(404, 'Lesson not found')
		}

		if (user.id !== lesson.user.id) {
			throw error(403, 'Forbidden')
		}

		if (!question) {
			throw error(404, 'Question not found')
		}

		if (user.id !== question.standTemplate.user.id) {
			throw error(403, 'Forbidden')
		}

		await prisma.questionAnwser.create({
			data: {
				lessonId: result.data.lessonId,
				questionId: result.data.questionId,
				rating: result.data.rating,
			}
		})

		return new Response(null)
	} catch (e) {
		console.log(e)
		
		throw error(500, 'Internal server error')
	}
}