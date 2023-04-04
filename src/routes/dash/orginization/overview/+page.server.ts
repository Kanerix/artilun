import { fail, redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'
import { z, type ZodIssue } from 'zod'
import { Prisma } from '@prisma/client'

interface Subject {
	id: number
	name: string
}

interface LoadData {
	usersCount: number
	lessonsCount: number
	subjects: Subject[]
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}


	const [usersCount, subjects, lessonsCount] = await prisma.$transaction([
		prisma.orginizationUser.count({
			where: { orginizationId: user.orginization.id }
		}),
		prisma.subject.findMany({
			where: { orginizationId: user.orginization.id }
		}),
		prisma.lesson.count({
			where: {
				subject: {
					orginizationId: user.orginization.id
				}
			}
		})
	])

	event.depends('subject:add')
	event.depends('subject:remove')

	return {
		usersCount,
		subjects,
		lessonsCount
	}
})

const addSubjectSchema = z.object({
	subject: z.string().min(1).max(100)
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries()) 

		const result = addSubjectSchema.safeParse(parseable)
		if (!result.success) {
			return fail(422, {
				issues: result.error.issues as ZodIssue[]
			})
		}

		const user = event.locals.user
		if (!user.orginization) {
			return fail(404, {
				issues: [{ 'message': 'Orginization not found' }] as ZodIssue[]
			})
		}
		
		try {
			await prisma.subject.create({
				data: {
					name: result.data.subject,
					orginizationId: user.orginization.id
				}
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(409, {
						issues: [{ message: 'Subject already exists' }] as ZodIssue[]
					})
				}
			}

			return fail(500, {
				issues: [{ message: 'Internal server error' }] as ZodIssue[]
			})
		}

		return { success: true }
	}
}