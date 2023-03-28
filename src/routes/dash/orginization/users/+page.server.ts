import prisma from '$lib/server/prisma'
import { OrginizationRole } from '@prisma/client'
import { fail } from '@sveltejs/kit'
import z, { type ZodIssue } from 'zod'

const orginizationInviteSchema = z.object({
	email: z.string().email(),
})
export const actions = {
	default: (async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		const result = orginizationInviteSchema.safeParse(parseable)
		if (!result.success) {
			return fail(422, {
				issues: result.error.issues
			})
		}

		const user = event.locals.user
		if (!user.orginization) {
			return fail(404, {
				issues: [{ 'message': 'Orginization not found' }] as ZodIssue[]
			})
		}

		const role = user.orginization.user.role
		if (role !== OrginizationRole.ADMIN && role !== OrginizationRole.OWNER) {
			return fail(403, {
				issues: [{ 'message': 'You do not have permission to do this' }] as ZodIssue[]
			})
		}

		try {
			const invitedUser = await prisma.user.findUnique({
				where: {
					email: result.data.email
				},
				select: {
					id: true,
					orginizationUser: {
						select: {
							userId: true
						}
					}
				}
			})

			if (!invitedUser) {
				return fail(404, {
					issues: [{ 'message': 'User not found' }] as ZodIssue[]
				})
			}

			if (invitedUser.orginizationUser?.userId) {
				return fail(404, {
					issues: [{ 'message': 'User is part of another orginization' }] as ZodIssue[]
				})
			}
			
			await prisma.orginizationIvite.create({
				data: {
					orginization: {
						connect: {
							id: user.orginization.id
						}
					},
					user: {
						connect: {
							id: invitedUser.id
						}
					}
				}
			})
		} catch (e) {
			return fail(500, {
				issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
			})
		}

		return { success: true }
	})
}