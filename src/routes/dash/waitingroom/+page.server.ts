import z, { type ZodIssue } from 'zod'
import prisma from '$lib/server/prisma'
import type { LayoutServerLoad } from '../$types'
import { fail, redirect } from '@sveltejs/kit'

interface Invite {
	orginization: {
		id: number
		name: string
	}
}

interface LoadData {
	invites: Invite[]
}

export const load: LayoutServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	const invites = {
		invites: await prisma.orginizationIvite.findMany({
			where: {
				userId: user.id
			},
			select: {
				orginization: {
					select: {
						id: true,
						name: true
					}
				},
			}
		})
	}

	return invites as { invites: Invite[] }
}) satisfies LayoutServerLoad

const createOrginization = z.object({
	name: z.string().min(3).max(255),
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		const result = createOrginization.safeParse(parseable)
		if (!result.success) {
			return fail(422, {
				issues: result.error.issues
			})
		}

		const user = event.locals.user
		try {
			const hasUser = Boolean(await prisma.orginizationUser.findFirst({
				where: {
					userId: user.id,
				}
			}))

			if (hasUser) {
				return fail(409, {
					issues: [{ 'message': 'User is already a part of an orginization' }] as ZodIssue[]
				})
			}
		} catch (e) {
			return fail(500, {
				issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
			})
		}

		try {
			await prisma.orginizationUser.create({
				data: {
					role: 'OWNER',
					user: {
						connect: {
							id: user.id
						}	
					},
					orginization: {
						create: {
							name: result.data.name
						}
					}
				},
			})
		} catch (e) {
			return fail(500, {
				issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
			})
		}

		event.cookies.delete('access_token')

		throw redirect(303, '/login')
	}
}