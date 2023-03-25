import type { Actions, PageServerLoad } from './$types'
import prisma from '$lib/prisma'
import { Prisma, type User } from '@prisma/client'
import z, { type ZodIssue } from 'zod'

export const load = (async ({ cookies }) => {
    if (cookies.get('refresh_token')) {
        // Redirect to home if user is already logged in
    }
}) satisfies PageServerLoad

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
            return {
                status: 422,
                issues: result.error.issues
            }
        }

        try {
            await prisma.user.create({
                data: result.data as User
            })		
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {
                    status: 409,
                    issues: [{ 'message': 'Email already exists' }] as ZodIssue[]
                }
            }

            return {
                status: 500,
                issues: [{ 'message': 'Internal server error' }] as ZodIssue[]
            }
        }
		
        return new Response('success', {
            status: 308,
            headers: {
                Location: '/login'
            }
        })
    }
} satisfies Actions