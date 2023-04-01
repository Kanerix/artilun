import * as z from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	DATABASE_URL: z.string().nonempty(),
	REDIS_URL: z.string().nonempty(),
	SALT_ROUNDS: z.string().nonempty(),
	JWT_SECRET: z.string().nonempty(),
})

export const env = envSchema.parse(process.env)