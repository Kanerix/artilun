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
		return new Response(null)
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'Stand question not found')
			}
		}

		console.log(e)
		
		throw error(500, 'Internal server error')
	}
}