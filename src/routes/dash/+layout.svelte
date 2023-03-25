<script lang="ts">
	import Fa from 'svelte-fa'
	import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
	import type { LayoutData } from './$types'
	import Divider from '../../components/Divider.svelte'
    import NavLink from '../../components/NavLink.svelte'

	export let data: LayoutData

	$: isSidebarOpen = false
</script>

<!-- Sidebar -->
<nav
	class={`${isSidebarOpen ? 'absolute' : 'hidden'} md:flex lg:flex-col
	px-6 py-4 h-screen w-[16rem] bg-white sidebar`}
>
	<div class="flex flex-col">
		<h1 class="text-sm font-semibold text-slate-500 uppercase my-4">
			Artilun
		</h1>
		{#each Object.entries(data) as [categoryTitle, pages]}
			<Divider />
			<h6 class="font-semibold text-xs text-slate-500 uppercase mt-4 mb-6">
				{categoryTitle}
			</h6>
			{#each pages as props}
				<NavLink {...props} />
			{/each}
		{/each}
	</div>
</nav>

<div class="w-full">
	<!-- Navbar -->
	<nav class="flex items-center justify-end w-full h-14 px-6 bg-slate-50">
		<button
			class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-200"
			on:click={() => isSidebarOpen = !isSidebarOpen}
		>
			<Fa class="text-lg text-slate-500" icon={faBars} />
		</button>
		<h1 class="md:hidden grow text-slate-500 text-center font-semibold text-sx uppercase">
			Artilun
		</h1>
		<button class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
			<Fa class="text-lg text-slate-500" icon={faUser} />
		</button>
	</nav>
	<div class="grid grid-cols-12 gap-4 p-10">
		<slot />
	</div>
</div>
