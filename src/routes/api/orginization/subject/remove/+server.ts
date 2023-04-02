
import z from 'zod'
import type { RequestHandler } from './$types'

const removeSubjectSchema = z.object({
	id: z.number().positive()
})

export const POST: RequestHandler = async (event) => {
	return new Response(null)
}