import { fail, redirect } from '@sveltejs/kit'
import { Prisma, type User } from '@prisma/client'
import z, { type ZodIssue } from 'zod'
import bcrypt from 'bcrypt'
import prisma from '$lib/server/prisma'
import { env } from '$lib/server/env'
import type { Actions } from '../register/$types'

const userRegisterSchema = z.object({
	firstName: z.string().min(2).max(255),
	lastName: z.string().min(2).max(255),
	email: z.string().email(),
	password: z.string().min(6).max(100)
})

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const parseable = Object.fromEntries(data.entries())

		// Parse data and validate the data
		const result = userRegisterSchema.safeParse(parseable)
		if (!result.success) {
			return fail(422, {
				issues: result.error.issues
			})
		}

		// Hash password
		const salt = await bcrypt.genSalt(parseInt(env.SALT_ROUNDS))
		result.data.password = await bcrypt.hash(result.data.password, salt)

		// Create user in the database
		try {
			await prisma.user.create({
				data: result.data as User
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

		// If sucessfull, redirect to login page
		throw redirect(308, '/login')
	}
} satisfies Actions