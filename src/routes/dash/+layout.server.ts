import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChalkboardTeacher, faGauge, faHouse, faSchool, faTable, faUsers } from '@fortawesome/free-solid-svg-icons'
import { OrginizationRole } from '@prisma/client'
import type { LayoutServerLoad } from './$types'

interface Categories {
	[key: string]: Link[]
}

interface Link {
	href: string
	title: string
	icon: IconDefinition
}
 
export const load = ((event): Categories => {
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

	return categories
}) satisfies LayoutServerLoad