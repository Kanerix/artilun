<script lang="ts">
	import Fa from "svelte-fa";
	import { page } from "$app/stores"
    import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

	export let href: string;
	export let icon: IconDefinition; 
	export let title: string;
	
	$: isActive = href === $page.url.pathname;
</script>

<a 
	{href}
	class="flex items-center w-full mb-4"
>
	<Fa
		icon={icon}
		class={`mr-4 hover text-xs ${isActive ? 'text-red-500' : 'text-slate-400'}`}
	>
	</Fa>
	<p
		{...$$props}
		class={
			`font-semibold text-xs uppercase py-2 mr-4 w-full 
			${isActive ? 'text-red-500' : 'text-slate-600 hover:text-slate-400'}`
		}
	>
		{title}
	</p>
</a>
