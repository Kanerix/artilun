import jwt from 'jsonwebtoken'
import { env } from '$lib/server/env'
import type { Role, User } from '@prisma/client'
import { redirect, type RequestEvent } from '@sveltejs/kit'
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
			role: Role
		}
	} 
}

export async function generateToken(user: User): Promise<string> {
	const payload = <CustomUserJwtPayload> {
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
		throw redirect(303, '/login')
	}

	try {
		event.locals.user = verifyToken(accessToken)	
	} catch (e) {
		if (e instanceof jwt.TokenExpiredError) {
			const databaseRefreshToken = await prisma.refreshToken.findFirst({
				where: {
					token: refreshToken,
				},
				select: {
					expiresAt: true,
					user: true
				},
			})

			if (databaseRefreshToken && databaseRefreshToken.expiresAt < new Date()) {
				const newAccessToken = await generateToken(databaseRefreshToken.user)
				event.cookies.set('access_token', newAccessToken)
				event.locals.user = verifyToken(newAccessToken)
			}
		}
	}
}