import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'
import { z, type ZodIssue } from 'zod'
import { Prisma } from '@prisma/client'

interface Subject {
	id: number
	name: string
}

interface StandTemplate {
	name: string
}

interface Lesson {
	id: number
	name: string
	subject: Subject
	standTemplate: StandTemplate
}

interface Template {
	id: number
	name: string
	subject: Subject
}

interface LoadData {
	lessons: Lesson[]
	templates: Template[]
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const [lessons, templates] = await prisma.$transaction([
		prisma.lesson.findMany({
			where: {
				userId: user.id
			},
			select: {
				id: true,
				name: true,
				subject: {
					select: {
						id: true,
						name: true
					}
				},
				standTemplate: {
					select: {
						name: true
					}
				}
			}
		}),
		prisma.standTemplate.findMany({
			where: {
				userId: user.id
			},
			select: {
				id: true,
				name: true,
				subject: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})
	])

	event.depends('lesson:create')
	event.depends('lesson:delete')

	return { 
		lessons,	
		templates
	}
})

const lessonSchema = z.object({
	lessonName: z.string().min(1).max(50),
	subjectId: z.string().min(1),
	templateId: z.string().min(1)
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		const result = lessonSchema.safeParse(parseable)
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
			await prisma.lesson.create({
				data: {
					name: result.data.lessonName,
					userId: user.id,
					subjectId: parseInt(result.data.subjectId),
					standTemplateId: parseInt(result.data.templateId)
				}
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(403, {
						issues: [{ 'message': 'Lesson already exsist' }] as ZodIssue[]
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