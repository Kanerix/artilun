import { redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

interface Question {
	question: string
	ratings: number[]
}

interface Lesson {
	id: number
	name: string
	questions: Record<number, Question> 
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
			subject: {
				select: {
					name: true
				}
			},
			anwsers: {
				select: {
					rating: true,
					question: {
						select: {
							question: true,
							id: true
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

	const questions: Record<number, Question> = {}

	for (const anwser of lesson.anwsers) {
		if (!questions[anwser.question.id]) {
			questions[anwser.question.id] = {
				question: anwser.question.question,
				ratings: []
			}
		}
		questions[anwser.question.id].ratings.push(anwser.rating)
	}

	return {
		lesson: {
			id: lesson.id,
			name: lesson.name,
			questions: questions
		}
	}
})