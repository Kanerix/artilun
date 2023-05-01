import { redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

interface Questions {
	id: number
	question: string
}

interface Lesson {
	id: number
	name: string
	questions: Questions[]
}

interface LoadData {
	lesson: Lesson
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}

	const lessonId = parseInt(event.params.id)
	const lesson = await prisma.lesson.findUnique({
		where: {
			id: lessonId
		},
		select: {
			id: true,
			name: true,
			user: {
				select: {
					id: true
				}
			},
			standTemplate: {
				select: {
					questions: {
						select: {
							id: true, 
							question: true
						}
					}
				}
			}
		}
	})

	if (!lesson) {
		throw redirect(302, '/dash/general/templates')
	}

	if (lesson.user.id !== user.id) {
		throw redirect(302, '/dash/general/templates')
	}

	return {
		lesson: {
			id: lesson.id,
			name: lesson.name,
			questions: lesson.standTemplate.questions
		}
	}
})