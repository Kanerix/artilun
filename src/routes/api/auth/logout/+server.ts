import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'

export const POST: RequestHandler = async (event) => {
	try {
		const refreshToken = event.cookies.get('refresh_token')

		if (!refreshToken) {
			throw 'no_refresh_token'
		}

		prisma.refreshToken.deleteMany({
			where: { token: refreshToken }
		})
	} finally {
		event.cookies.delete('access_token', { path: '/' })
		event.cookies.delete('refresh_token', { path: '/' })
	}

	throw redirect(302, '/login')
}