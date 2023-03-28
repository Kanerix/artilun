import jwt from 'jsonwebtoken'
import { env } from '$lib/server/env'
import type { OrginizationRole, User } from '@prisma/client'
import type { RequestEvent } from '@sveltejs/kit'
import prisma from './prisma'

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

	try {
		if (!accessToken) {
			throw 'No access token'
		}

		event.locals.user = verifyToken(accessToken)	
	} catch (e) {
		if (!refreshToken) {
			return
		}

		if (e instanceof jwt.TokenExpiredError || e === 'No access token') {
			const databaseRefreshToken = await prisma.refreshToken.findFirst({
				where: {
					token: refreshToken,
				},
				select: {
					expiresAt: true,
					user: true
				},
			})

			if (!databaseRefreshToken) {
				return
			}

			if (databaseRefreshToken.expiresAt > new Date()) {
				const newAccessToken = await generateToken(databaseRefreshToken.user)
				event.cookies.set('access_token', newAccessToken, { path: '/' })
				event.locals.user = decodeToken(newAccessToken)
			}	
		}
	}
}