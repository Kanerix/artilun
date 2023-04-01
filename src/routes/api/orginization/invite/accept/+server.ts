import z from 'zod'
import { Prisma } from '@prisma/client'
import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'
import redis from '$lib/server/redis'

const acceptInviteSchema = z.object({
	id: z.number().positive()
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = acceptInviteSchema.safeParse(data)
	if (!result.success) {
		throw error(422, 'Invalid data')
	}

	const user = event.locals.user
	if (user.orginization) {
		throw error(403, 'You already are a part of an other orginization')
	}

	try {
		const invite = await prisma.orginizationIvite.findUnique({
			where: { id: result.data.id },
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

		const [userId] = await prisma.$transaction([
			prisma.orginizationUser.create({
				data: {
					userId: user.id,
					orginizationId: invite.orginization.id,
				},
				select: {
					user: {
						select: {
							id: true
						}
					}
				}
			}),
			prisma.orginizationIvite.delete({
				where: { id: result.data.id }
			})
		])

		redis.set(`blocked:${userId.user.id}`, '1', { EX: 900 })

		return new Response(null)
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code == 'P2025') {
				throw error(404, 'Invite not found')
			}
		}
		
		throw error(500, 'Internal server error')
	}
}