import { z } from  'zod'
import { Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'

const deleteStandQuestionSchema = z.object({
	id: z.number().positive(),
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = deleteStandQuestionSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user

	try {
		const standQuestion = await prisma.standQuestion.findFirst({
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

		if (!standQuestion) {
			throw error(404, 'Stand question not found')
		}

		if (user.id !== standQuestion.standTemplate.user.id) {
			throw error(403, 'Forbidden')
		}

		await prisma.standQuestion.delete({
			where: {
				id: result.data.id,
			}
		})

		return new Response(null)
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'Stand question not found')
			} else if (e.code == 'P2003') {
				throw error(403, 'Stand question used in lesson')
			}
		}

		console.log(e)
		
		throw error(500, 'Internal server error')
	}
}