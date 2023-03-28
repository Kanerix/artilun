import type { CustomUserJwtPayload } from '$lib/server/auth'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: CustomUserJwtPayload
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}