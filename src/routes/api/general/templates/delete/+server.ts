import { z } from  'zod'
import { Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'

const deleteStandTemplateSchema = z.object({
	id: z.number().positive(),
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = deleteStandTemplateSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user

	try {
		const standTemplate = await prisma.standTemplate.findUnique({
			where: { id: result.data.id },
			select: { id: true, userId: true }
		})

		if (!standTemplate) {
			throw error(404, 'Stand template not found')
		}

		if (standTemplate.userId != user.id) {
			throw error(403, 'You do not own the stand template')
		}

		await prisma.standTemplate.delete({
			where: {
				id: standTemplate.id
			}
		})

		return new Response(null)
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'Stand template not found')
			}
		}

		console.log(e)
		
		throw error(500, 'Internal server error')
	}
}