import { redirect, type Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'
import { generateToken, verifyToken, type CustomUserJwtPayload } from '$lib/server/auth'
import prisma from '$lib/server/prisma'

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('access_token')
	const refreshToken = event.cookies.get('refresh_token')
	if (accessToken) {
		try {
			event.locals.user = verifyToken(accessToken)	
		} catch (e) {
			if (e instanceof jwt.TokenExpiredError) {
				if (refreshToken) {
					const decodedToken = <CustomUserJwtPayload>jwt.decode(accessToken)
					const dbToken = await prisma.refreshToken.findFirst({
						where: {
							token: refreshToken,
							userId: decodedToken.userId
						},
						select: {
							expiresAt: true,
							user: true,
						}
					})

					if (dbToken && dbToken.expiresAt < new Date()) {
						const newAccessToken = generateToken(dbToken.user)
						event.cookies.set('access_token', newAccessToken)
						event.locals.user = verifyToken(newAccessToken)
					}
				}
			}
		}
	}

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
		if (pathname.startsWith('/dash/orginization') && (role === Role.ADMIN || role === Role.OWNER)) {
			throw redirect(303, '/dash/general/hom')
		}
	}

	console.log('test')

	const response = await resolve(event)
	return response
}