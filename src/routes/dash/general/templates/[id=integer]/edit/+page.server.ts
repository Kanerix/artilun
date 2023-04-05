import { redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

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

	return {
		template
	}
})