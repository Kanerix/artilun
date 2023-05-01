import { redirect, type Handle } from '@sveltejs/kit'
import { OrginizationRole } from '@prisma/client'
import { autenticate } from '$lib/server/auth'

export const handle: Handle = async ({ event, resolve }) => {
	await autenticate(event)

	const pathname = event.url.pathname
	const user = event.locals.user

	if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
		if (user) {
			throw redirect(303, '/dash/general/home')
		} 
	} else if (pathname.startsWith('/dash')) {
		if (!user) {
			throw redirect(303, '/login')
		}

		if (pathname.startsWith('/dash/waitingroom') && user.orginization) {
			throw redirect(303, '/dash/general/home')
		}

		if (pathname.startsWith('/dash/orginization') || pathname.startsWith('/dash/general') || pathname.startsWith('/lessons')) {
			if (!user.orginization) {
				throw redirect(303, '/dash/waitingroom')
			}

			const role = user.orginization.user.role
			if (
				pathname.startsWith('/dash/orginization') &&
				(role !== OrginizationRole.ADMIN && role !== OrginizationRole.OWNER)
			) {
				throw redirect(303, '/dash/general/home')
			}
		}
	}

	const response = await resolve(event)
	return response
}