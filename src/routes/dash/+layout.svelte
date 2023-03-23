<script lang="ts">
	import type { LayoutData } from "./$types";
	import { page } from '$app/stores';
	import Divider from "../../components/Divider.svelte";
    import NavLink from '../../components/NavLink.svelte';

	$: isActive = $page.url.pathname === $$props.href

	export let data: LayoutData;
</script>

<nav
	class="flex flex-col h-screen 
	px-6 py-4 max-w-[16rem]
	border-r-2 border-slate-200"
>
	<div class="flex flex-col w-full">
		<h1 class="text-sm font-semibold text-slate-600 uppercase my-4">
			Artilun
		</h1>
		{#each Object.entries(data) as [categoryTitle, pages]}
			<Divider />
			<h6 class="font-semibold text-xs text-slate-500 uppercase my-6">
				{categoryTitle}
			</h6>
			<ul>
				{#each pages as props}
					<NavLink {...props} />
				{/each}
			</ul>
		{/each}
	</div>
</nav>

<slot />
