import { fail, redirect } from '@sveltejs/kit'
import { Prisma, type User } from '@prisma/client'
import bcrypt from 'bcrypt'
import z, { type ZodIssue } from 'zod'
import prisma from '$lib/server/prisma'
import { generateToken } from '$lib/server/auth'
import type { Actions } from '../login/$types'

const userLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(100)
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		// Parse data and validate the data
		const result = userLoginSchema.safeParse(parseable)
		if (!result.success) {
			return fail(422, {
				issues: result.error.issues
			})
		}

		let user: User | null

		try {
			user = await prisma.user.findUnique({
				where: {
					email: result.data.email
				}
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				return fail(409, {
					issues: [{ 'message': 'Email already exists' }] as ZodIssue[]
				})
			}

			return fail(500, {
				issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
			})
		}

		if (user === null) {
			return fail(409, {
				issues: [{ 'message': 'User does not exists' }] as ZodIssue[]
			})
		}

		const isRightPassword = await bcrypt.compare(result.data.password, user.password)
		if (!isRightPassword) {
			return fail(409, {
				issues: [{ 'message': 'Wrong password' }] as ZodIssue[]
			})
		}

		const accessToken = await generateToken(user)
		const refreshToken = Math.random().toString(36).substring(2, 500) + Math.random().toString(36).substring(2, 500)

		try {
			await prisma.refreshToken.create({
				data: {
					token: refreshToken,
					userId: user.id,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
				}
			})
		} catch (e) {
			return fail(500, {
				issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
			})
		}

		event.cookies.set('access_token', accessToken, { path: '/', httpOnly: false })
		event.cookies.set(
			'refresh_token',
			refreshToken,
			{
				httpOnly: true,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
			}
		)

		throw redirect(302, '/dash/general/home')
	}
} satisfies Actions