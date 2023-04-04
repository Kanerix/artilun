import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

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

	return {
		templates: []
	}
})