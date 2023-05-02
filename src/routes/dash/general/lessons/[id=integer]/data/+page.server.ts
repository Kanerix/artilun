import { redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

interface Ratings {
	'Very bad': number
	'Bad': number
	'Mediocre': number
	'Good': number
	'Very good': number
}

interface Question {
	question: string
	ratings: Ratings
	ratingsRaw: number[]
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
				ratings: {
					'Very bad': 0,
					'Bad': 0,
					'Mediocre': 0,
					'Good': 0,
					'Very good': 0
				},
				ratingsRaw: []
			}
		}


		questions[anwser.question.id].ratingsRaw.push(anwser.rating)

		switch (anwser.rating) {
			case 1:
				questions[anwser.question.id].ratings['Very bad']++
				break
			case 2:
				questions[anwser.question.id].ratings['Bad']++
				break
			case 3:
				questions[anwser.question.id].ratings['Mediocre']++
				break
			case 4:
				questions[anwser.question.id].ratings['Good']++
				break
			case 5:
				questions[anwser.question.id].ratings['Very good']++
		}
	}

	return {
		lesson: {
			id: lesson.id,
			name: lesson.name,
			questions: questions
		}
	}
})