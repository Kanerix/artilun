import type { Actions, PageServerLoad } from './$types'
import prisma from '$lib/prisma'
import { Prisma, type User } from '@prisma/client'
import z, { type ZodIssue } from 'zod'

export const load = (async ({ cookies }) => {
    if (cookies.get('refresh_token')) {
        // Redirect to home if user is already logged in
    }
}) satisfies PageServerLoad

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
            return {
                status: 422,
                issues: result.error.issues
            }
        }

        try {
            await prisma.user.findUnique({
                where: {
                    email: result.data.email
                }
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
            }
        }
		
        return new Response('success', {
            status: 308,
            headers: {
                Location: '/signin'
            }
        })
    }
} satisfies Actions