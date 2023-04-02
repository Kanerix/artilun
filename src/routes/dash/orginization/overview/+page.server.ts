import { redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

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


	const [usersCount, lessonsCount, subjects] = await prisma.$transaction([
		prisma.orginizationUser.count({
			where: { orginizationId: user.orginization.id }
		}),
		prisma.lesson.count({
			where: {
				subject: {
					orginizationId: user.orginization.id
				}
			}
		}),
		prisma.subject.findMany({
			where: { orginizationId: user.orginization.id }
		}),
	])

	return {
		usersCount,
		lessonsCount,
		subjects
	}
})