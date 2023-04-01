import jwt from 'jsonwebtoken'
import { env } from '$lib/server/env'
import type { OrginizationRole, User } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'
import prisma from './prisma'
import { decode } from 'punycode'
import redis from './redis'

export interface CustomUserJwtPayload extends jwt.JwtPayload {
	id: number
	firstName: string
	lastName: string
	orginization?: {
		id: number,
		name: string,
		user: {
			id: number,
			role: OrginizationRole
		}
	} 
}

export async function generateToken(user: User): Promise<string> {
	const payload: CustomUserJwtPayload = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
	}

	const orginizationUser = await prisma.orginizationUser.findUnique({
		where: {
			userId: user.id
		},
		select: {
			id: true,
			role: true,
			orginization: {
				select: {
					id: true,
					name: true
				}
			}
		}
	})

	if (orginizationUser) {
		payload.orginization = {
			id: orginizationUser.orginization.id,
			name: orginizationUser.orginization.name,
			user: {
				id: orginizationUser.id,
				role: orginizationUser.role
			}
		}
	}

	return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' })
}

export function verifyToken(token: string): CustomUserJwtPayload {
	return <CustomUserJwtPayload>jwt.verify(token, env.JWT_SECRET)
}

export function decodeToken(token: string): CustomUserJwtPayload {
	return <CustomUserJwtPayload>jwt.decode(token)
}

export async function autenticate(event: RequestEvent): Promise<void> {
	const accessToken = event.cookies.get('access_token')
	const refreshToken = event.cookies.get('refresh_token')

	if (!accessToken || !refreshToken) {
		return 
	}

	try {
		const decoded = decodeToken(accessToken)

		const blocked = await redis.get(decoded.id.toString()) 
		if (blocked === 'true') {
			throw 'regenerate'
		}

		event.locals.user = verifyToken(accessToken)	
	} catch (e) {
		if (e instanceof jwt.TokenExpiredError || e === 'regenerate') {
			const token = await prisma.refreshToken.findFirst({
				where: { token: refreshToken, },
				select: { id: true, expiresAt: true, user: true },
			})

			if (!token || token.expiresAt > new Date()) {
				return
			}

			const newAccessToken = await generateToken(token.user)
			event.cookies.set('access_token', newAccessToken, { path: '/' })
			event.locals.user = decodeToken(newAccessToken)
		}
	}
}