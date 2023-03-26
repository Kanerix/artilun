import jwt from 'jsonwebtoken'
import { env } from '$lib/server/env'
import type { Role, User } from '@prisma/client'
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

export async function generateToken(user: User) {
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

export function verifyToken(token: string) {
	return <CustomUserJwtPayload>jwt.verify(token, env.JWT_SECRET, {
		algorithms: ['HS256']
	})
}

export function decodeToken(token: string) {
	return <CustomUserJwtPayload>jwt.decode(token)
}
