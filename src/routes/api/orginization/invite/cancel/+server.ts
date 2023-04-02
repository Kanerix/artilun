import { z } from  'zod'
import { OrginizationRole, Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'

const cancelInviteSchema = z.object({
	id: z.number().positive()
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = cancelInviteSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user
	if (!user.orginization || user.orginization.user.role === OrginizationRole.USER) {
		throw error(403, 'You don\'t have permission to do that')
	}

	try {
		const invite = await prisma.orginizationIvite.findUnique({
			where: {
				id: result.data.id 
			},
			select: {
				orginization: {
					select: {
						id: true
					}
				}
			}
		})

		if (!invite) {
			throw error(404, 'Invite not found')
		}

		if (invite.orginization.id !== user.orginization.id) {
			throw error(403, 'You don\'t have permission to do that')
		}

		await prisma.orginizationIvite.delete({
			where: {
				id: result.data.id
			}
		})

		return new Response(null)
	} catch (e) {
		console.log(e)

		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'Invite not found')
			}
		}
		
		throw error(500, 'Internal server error')
	}
}