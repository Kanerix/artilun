import jwt from 'jsonwebtoken'
import { env } from '$lib/server/env'
import type { User } from '@prisma/client'

export interface CustomUserJwtPayload extends jwt.JwtPayload {
	userId: number
	firstName: string
	lastName: string
	orginization: {
		id: number,
		name: string,
	} 
}

export function generateToken(user: User) {
	return jwt.sign({
		id: user.id,
		firstName: user.firstName,
		lsatName: user.lastName,
	},
	env.JWT_SECRET,
	{
		expiresIn: '15m'
	})
}

export function verifyToken(token: string) {
	return <CustomUserJwtPayload>jwt.verify(token, env.JWT_SECRET)
}

export function decodeToken(token: string) {
	return <CustomUserJwtPayload>jwt.decode(token)
}
