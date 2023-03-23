import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChalkboardTeacher, faHouse, faTable, faUser } from '@fortawesome/free-solid-svg-icons'
import type { LayoutLoad } from './$types'

interface Categories {
	[key: string]: Page[]
}

interface Page {
	href: string
	title: string
	icon: IconDefinition
}
 
export const load = ((): Categories => {
    return {
        'General': [
            { href: '/dash/home', title: 'Home', icon: faHouse },
            { href: '/dash/templates', title: 'Templates', icon: faTable },
            { href: '/dash/lessons', title: 'Lessons', icon: faChalkboardTeacher }
        ],
        'Orginization': [
            { href: '/dash/users', title: 'Users', icon: faUser },
        ]
    }
}) satisfies LayoutLoad