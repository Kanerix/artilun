import { redirect } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

interface LoadData {
	usersCount: number
	subjectsCount: number
	lessonsCount: number
}

export const load: PageServerLoad = (async (event): Promise<LoadData> => {
	const user = event.locals.user
	if (!user.orginization) {
		throw redirect(302, '/dash/waitingroom')
	}


	const [usersCount, subjectsCount, lessonsCount] = await prisma.$transaction([
		prisma.orginizationUser.count({
			where: { orginizationId: user.orginization.id }
		}),
		prisma.subject.count({
			where: { orginizationId: user.orginization.id }
		}),
		prisma.lesson.count({
			where: {
				subject: {
					orginizationId: user.orginization.id
				}
			}
		})
	])

	return {
		usersCount,
		subjectsCount,
		lessonsCount
	}
})