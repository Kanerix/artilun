import { redirect, type Handle } from '@sveltejs/kit'
import { OrginizationRole } from '@prisma/client'
import { autenticate } from '$lib/server/auth'

export const handle: Handle = async ({ event, resolve }) => {
	await autenticate(event)

	const pathname = event.url.pathname
	if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && event.locals.user) {
		throw redirect(303, '/dash/general/home')
	} else if (pathname.startsWith('/dash')) {
		if (!event.locals.user) {
			throw redirect(303, '/login')
		}

		const orginizationId = event.locals.user.orginizationId
		if (!orginizationId && pathname.startsWith('/dash/general')) {
			throw redirect(303, '/dash/waitingroom')
		}
	
		const role = event.locals.user.role
		if (pathname.startsWith('/dash/orginization') &&
			(role === OrginizationRole.ADMIN || role === OrginizationRole.OWNER)) {
			throw redirect(303, '/dash/general/hom')
		}
	}

	const response = await resolve(event)
	return response
}