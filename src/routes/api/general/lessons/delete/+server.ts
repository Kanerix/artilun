import { z } from  'zod'
import { Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'

const deleteLessonSchema = z.object({
	id: z.number().positive(),
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = deleteLessonSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user

	try {
		const lesson = await prisma.lesson.findFirst({
			where: {
				id: result.data.id,
			},
			select: {
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

		if (!lesson) {
			throw error(404, 'Lesson not found')
		}

		if (user.id !== lesson.standTemplate.user.id) {
			throw error(403, 'Forbidden')
		}

		await prisma.lesson.delete({
			where: {
				id: result.data.id,
			},
			include: {
				anwsers: true,
			}
		})

		return new Response(null)
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'Lesson not found')
			} else if (e.code == 'P2003') {
				throw error(403, 'Lesson used in relation')
			}
		}

		console.log(e)
		
		throw error(500, 'Internal server error')
	}
}