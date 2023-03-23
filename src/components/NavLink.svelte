<script lang="ts">
	import Fa from "svelte-fa";
	import { page } from "$app/stores"
    import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

	export let slug: string;
	export let icon: IconDefinition; 
	export let title: string;

	$: isActive = $page.url.pathname === $$props.href
</script>

<a href="/dash/{slug}" class="flex items-center w-full mb-4">
	<Fa
		icon={icon}
		class="mr-4 hover {isActive ? 'text-red-500' : 'text-slate-300'} text-xs"
	>
	</Fa>
	<p
		{...$$props}
		class="font-semibold text-xs uppercase py-2 mr-4 
		text-slate-600 hover:text-slate-400 w-full"
		class:text-red-500="{isActive}"
	>
		{title}
	</p>
</a>
