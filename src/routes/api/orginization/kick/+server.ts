import z from 'zod'
import { OrginizationRole, Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'
import redis from '$lib/server/redis'

const kickUserSchema = z.object({
	id: z.number().positive()
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = kickUserSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user
	if (!user.orginization || user.orginization?.user.role === OrginizationRole.USER) {
		throw error(403, 'You don\'t have permission to do that')
	}

	const userToKick = await prisma.orginizationUser.findUnique({
		where: {
			id: result.data.id 
		},
		select: {
			id: true,
			role: true
		}
	})

	if (!userToKick) {
		throw error(404, 'User not found')
	}

	if (userToKick.role === OrginizationRole.OWNER) {
		throw error(403, 'You can\'t kick the owner')
	}

	if (userToKick.role === OrginizationRole.ADMIN && user.orginization?.user.role !== OrginizationRole.OWNER) {
		throw error(403, 'You can\'t kick an admin as a non-owner')
	}

	try {
		const deleted = await prisma.orginizationUser.delete({
			where: {
				id: result.data.id
			},
			select: {
				user: {
					select: {
						id: true
					}
				}
			}
		})

		redis.set(deleted.user.id.toString(), 'true')

		return new Response(null)
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'User not found')
			}
		}
		
		throw error(500, 'Internal server error')
	}
}