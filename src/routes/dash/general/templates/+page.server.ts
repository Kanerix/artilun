import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'
import { z, type ZodIssue } from 'zod'

interface Template {
	id: number
	name: string
}

interface LoadData {
	templates: Template[]
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const templates = await prisma.standTemplate.findMany({
		where: {
			userId: user.id
		}
	})

	return {
		templates
	}
})

const orginizationTemplateSchema = z.object({
	name: z.string().min(1).max(50)
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

		return { success: true }
	}
}