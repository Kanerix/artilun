import type { LayoutLoad } from './$types'

interface Categories {
	[key: string]: Page[]
}

interface Page {
	slug: string
	title: string
}
 
export const load = ((): Categories => {
    return {
        'Overview': [
            { slug: 'overview', title: 'Overview' },
            { slug: 'templates', title: 'Templates' }
        ],
        'Orginization': [
            { slug: 'overview', title: 'Overview' },
            { slug: 'templates', title: 'Templates' }
        ]
    }
}) satisfies LayoutLoad