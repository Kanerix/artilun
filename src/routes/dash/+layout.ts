import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faTable, faUser } from '@fortawesome/free-solid-svg-icons'
import type { LayoutLoad } from './$types'

interface Categories {
	[key: string]: Page[]
}

interface Page {
	slug: string
	title: string
	icon: IconDefinition
}
 
export const load = ((): Categories => {
    return {
        'General': [
            { slug: 'home', title: 'Home', icon: faHouse },
            { slug: 'templates', title: 'Templates', icon: faTable }
        ],
        'Orginization': [
            { slug: 'users', title: 'Users', icon: faUser },
        ]
    }
}) satisfies LayoutLoad