<script lang="ts">
    import Divider from '../../components/Divider.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav class="flex flex-col h-screen px-6 py-4 max-w-[250px]">
	<div class="flex flex-col w-full">
		<h1 class="text-lg font-semibold">
			ARTILUN
		</h1>
		<ul>
			{#each Object.entries(data) as [categoryTitle, pages]}
				<Divider />
				<h6 class="font-semibold text-sm text-slate-700 uppercase py-4">
					{categoryTitle}
				</h6>
				{#each pages as page}
					<ul class="mb-4">
						<a
							class="font-semibold text-sm text-slate-800 uppercase py-1"
							href="/dashboard/{page.slug}"
						>
							{page.title}
						</a>
					</ul>
				{/each}
			{/each}
		</ul>
	</div>
</nav>

<slot />
