import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async (event) => {
	event.cookies.delete('access_token', { path: '/' })
	event.cookies.delete('refresh_token', { path: '/' })
	throw redirect(302, '/login')
}