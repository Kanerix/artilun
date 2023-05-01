import { fail, redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'
import { z, type ZodIssue } from 'zod'
import { Prisma } from '@prisma/client'

interface Questions {
	id: number
	question: string
}

interface Template {
	id: number
	name: string
	questions: Questions[]
}

interface LoadData {
	template: Template
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const templateId = parseInt(event.params.id)
	const template = await prisma.standTemplate.findUnique({
		where: {
			id: templateId
		},
		select: {
			id: true,
			name: true,
			questions: {
				select: {
					id: true,
					question: true
				}
			},
			user: {
				select: {
					id: true
				}
			}
		}
	})

	if (!template) {
		throw redirect(302, '/dash/general/templates')
	}

	if (template.user.id !== user.id) {
		throw redirect(302, '/dash/general/templates')
	}

	event.depends('question:create')
	event.depends('question:delete')

	return {
		template
	}
})

const questionSchema = z.object({
	question: z.string().min(1).max(255),
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		const result = questionSchema.safeParse(parseable)
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

		try {
			await prisma.standQuestion.create({
				data: {
					question: result.data.question,
					standTemplate: {
						connect: {
							id: parseInt(event.params.id)
						}
					}
				}
			})	
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(403, {
						issues: [{ 'message': 'Stand template already exsist' }] as ZodIssue[]
					})
				}
			}

			console.error(e)

			return fail(500, {
				issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
			})
		}

		return { success: true }
	}
}