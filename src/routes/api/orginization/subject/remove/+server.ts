import { z } from  'zod'
import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'
import { OrginizationRole } from '@prisma/client'
import prisma from '$lib/server/prisma'

const removeSubjectSchema = z.object({
	id: z.number().positive()
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = removeSubjectSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user
	if (!user.orginization || user.orginization?.user.role === OrginizationRole.USER) {
		throw error(403, 'You don\'t have permission to do that')
	}

	try {
		const subject = await prisma.subject.findFirst({
			where: {
				id: result.data.id,
				orginizationId: user.orginization.id
			},
			select: {
				id: true
			}
		})

		if (!subject) {
			throw error(404, 'Subject not found')
		}

		await prisma.subject.delete({
			where: {
				id: subject.id
			}
		})
	} catch (e) {
		throw error(500, 'Internal server error')
	}

	return new Response(null)
}