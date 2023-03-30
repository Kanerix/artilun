import { decodeToken } from '$lib/server/auth'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChalkboardTeacher, faGauge, faHouse, faSchool, faTable, faUsers } from '@fortawesome/free-solid-svg-icons'
import { OrginizationRole } from '@prisma/client'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

interface Link {
	href: string
	title: string
	icon: IconDefinition
}

interface Categories {
	[key: string]: Link[]
}

interface SidebarData {
	user: {
		firstName: string
		lastName: string
	}
	categories: Categories
}

export const load = ((event): SidebarData => {
	const user = event.locals.user
	const categories: Categories = {}

	if (!user.orginization) {
		categories['Waitingroom'] = [
			{ href: '/dash/waitingroom', title: 'Orginizations', icon: faSchool }
		]
	} else {
		categories['General'] = [
			{ href: '/dash/general/home', title: 'Home', icon: faHouse },
			{ href: '/dash/general/templates', title: 'Templates', icon: faTable },
			{ href: '/dash/general/lessons', title: 'Lessons', icon: faChalkboardTeacher }
		]

		if (user.orginization.user.role === OrginizationRole.ADMIN || user.orginization.user.role === OrginizationRole.OWNER) {
			categories['Orginization'] = [
				{ href: '/dash/orginization/overview', title: 'Overview', icon: faGauge },
				{ href: '/dash/orginization/users', title: 'Users', icon: faUsers },
			]
		}
	}

	const accessToken = event.cookies.get('access_token')
	if (!accessToken) {
		throw redirect(302, '/login')
	}

	return {
		user: decodeToken(accessToken),
		categories,
	}
}) satisfies LayoutServerLoad