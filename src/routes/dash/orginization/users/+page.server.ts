import prisma from '$lib/server/prisma'
import { OrginizationRole } from '@prisma/client'
import { fail, redirect } from '@sveltejs/kit'
import { z, type ZodIssue } from 'zod'
import type { PageServerLoad } from './$types'

interface UserTableData {
	id: number
	firstName: string
	lastName: string
	email: string
	role: string
}

interface UserInvite {
	id: number
	email: string
}

interface LoadData {
	userTableData: UserTableData[]
	invites: UserInvite[]
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const [orginizationUsers, orginizationIvites] = await prisma.$transaction([
		prisma.orginizationUser.findMany({
			where: { orginizationId: user.orginization.id },
			select: {
				id: true,
				role: true,
				user: {
					select: {
						firstName: true,
						lastName: true,
						email: true
					}
				}
			}
		}),
		prisma.orginizationIvite.findMany({
			where: { orginizationId: user.orginization.id },
			select: {
				id: true,
				user: {
					select: {
						email: true
					}
				}
			}
		})
	])

	const users = orginizationUsers.map((user) => ({
		id: user.id,
		firstName: user.user.firstName,
		lastName: user.user.lastName,
		email: user.user.email,
		role: user.role
	}))

	const invites = orginizationIvites.map((invite) => ({
		id: invite.id,
		email: invite.user.email,
	}))

	event.depends('invite:send')
	event.depends('invite:cancel')
	event.depends('user:kick')

	return {
		userTableData: users as UserTableData[],
		invites: invites as UserInvite[]
	}
})

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
				where: { email: result.data.email },
				select: {
					id: true,
					orginizationUser: {
						select: {
							userId: true
						}
					},
					orginizationInvites: {
						select: {
							userId: true
						}
					}
				}
			})

			if (invitedUser?.orginizationInvites.filter(
				(invite) => invite.userId === invitedUser.id
			).length) {
				return fail(404, {
					issues: [{ 'message': 'User already invited' }] as ZodIssue[]
				})
			}

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