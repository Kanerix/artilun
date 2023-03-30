import z from 'zod'
import { OrginizationRole, type OrginizationUser } from '@prisma/client'
import { fail } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { RequestHandler } from './$types'

const kickUserSchema = z.object({
	id: z.number().positive()
})

export const POST: RequestHandler = async (event) => {
	const data = await event.request.json()
	const result = kickUserSchema.safeParse(data)
	if (!result.success) {
		throw fail(422, {
			issue: 'Invalid data' 
		})
	}

	const user = event.locals.user
	if (user.orginization?.user.role === OrginizationRole.USER) {
		throw fail(403, {
			issue: 'You don\'t have permission to do that'
		})
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
		throw fail(404, {
			issue: 'User not found'
		})
	}

	if (userToKick.role === OrginizationRole.OWNER) {
		throw fail(403, {
			issue: 'You can\'t kick the owner'
		})
	}

	if (userToKick.role === OrginizationRole.ADMIN && user.orginization?.user.role !== OrginizationRole.OWNER) {
		throw fail(403, {
			issue: 'You can\'t kick an admin as a non-owner'
		})
	}

	try {
		await prisma.orginizationUser.delete({
			where: {
				id: result.data.id
			}
		})
	} catch (e) {
		throw fail(500, {
			issue: 'Internal server error'
		})
	}

	return new Response(null)
}