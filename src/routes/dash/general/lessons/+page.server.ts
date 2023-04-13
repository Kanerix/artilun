import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'

interface Lesson {
	id: number
	name: string
	subject: string
}

interface LoadData {
	lessons: Lesson[]
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const lessons = await prisma.lesson.findMany({
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

	return { 
		lessons: lessons.map(({ id, name, subject }) =>
			({ id, name, subject: subject.name })
		)
	}
})