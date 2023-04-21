import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'
import { z, type ZodIssue } from 'zod'
import { Prisma } from '@prisma/client'

interface Subject {
	name: string
}

interface Template {
	id: number
	name: string
	subject: Subject
}

interface LoadData {
	templates: Template[]
	subjects: Subject[]
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const templates = await prisma.standTemplate.findMany({
		where: {
			userId: user.id
		},
		select: {
			id: true,
			name: true,
			subject: {
				select: {
					name: true
				}
			}
		}
	})
	
	const subjects = await prisma.subject.findMany({
		where: {
			orginizationId: user.orginization.id
		},
		select: {
			name: true,
		}
	})

	event.depends('template:create')
	event.depends('template:remove')

	return {
		templates,
		subjects
	}
})

const orginizationTemplateSchema = z.object({
	templateName: z.string().min(1).max(50),
	subjectName: z.string().min(1).max(50)
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		const result = orginizationTemplateSchema.safeParse(parseable)
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

		const subject = await prisma.subject.findUnique({
			where: {
				orginizationIdentifier: {
					name: result.data.subjectName,
					orginizationId: user.orginization.id
				}
			},
			select: {
				id: true
			}
		})

		if (!subject) {
			return fail(404, {
				issues: [{ 'message': 'Subject not found' }] as ZodIssue[]
			})
		}

		try {
			await prisma.standTemplate.create({
				data: {
					name: result.data.templateName,
					userId: user.id,
					subjectId: subject.id 
				}
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(404, {
						issues: [{ 'message': 'Template name already exsist' }] as ZodIssue[]
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