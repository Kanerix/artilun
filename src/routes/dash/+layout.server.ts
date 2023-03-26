import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChalkboardTeacher, faHouse, faTable, faUsers } from '@fortawesome/free-solid-svg-icons'
import { OrginizationRole } from '@prisma/client'
import type { LayoutServerLoad } from './$types'

interface Categories {
	[key: string]: Page[]
}

interface Page {
	href: string
	title: string
	icon: IconDefinition
}
 
export const load = ((event): Categories => {
	const user = event.locals.user
	if (!user) return {}

	const categories: Categories = {}

	if (!user.orginization) {
		categories['Waitingroom'] = [
			{ href: '/dash/waitingroom', title: 'Waitingroom', icon: faChalkboardTeacher }
		]
	} else {
		categories['General'] = [
			{ href: '/dash/general/home', title: 'Home', icon: faHouse },
			{ href: '/dash/general/templates', title: 'Templates', icon: faTable },
			{ href: '/dash/general/lessons', title: 'Lessons', icon: faChalkboardTeacher }
		]

		if (user.role === OrginizationRole.ADMIN || user.role === OrginizationRole.OWNER) {
			categories['Orginization'] = [
				{ href: '/dash/orginization/users', title: 'Users', icon: faUsers },
			]
		}
	}

	return categories
}) satisfies LayoutServerLoad