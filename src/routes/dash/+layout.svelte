<script lang="ts">
	import Fa from 'svelte-fa'
	import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
	import {
		Menu,
		MenuButton,
		MenuItems,
	} from "@rgossiaux/svelte-headlessui";
	import type { LayoutData } from './$types'
    import { invalidate } from '$app/navigation';
    import { page } from '$app/stores';
	import Divider from '../../components/Divider.svelte'
    import Button from '../../components/Button.svelte';

	export let data: LayoutData

	async function logout() {
		await fetch('/api/auth/logout', {
			method: 'POST'
		})
		invalidate('auth:logout')
	}

	let isOpen = false

	$: isOpen
</script>

<!-- Sidebar -->
<nav class="{isOpen ? 'absolute' : 'hidden'} md:shadow-none shadow-md px-6 py-4 min-h-screen w-[16rem] bg-white">
	<div class="flex flex-col">
		<h1 class="text-sm font-semibold text-slate-500 uppercase my-4">
			Artilun
		</h1>
		<Divider />
		<div class="flex items-center bg-slate-100 rounded h-20 my-6 p-3">
			<div class="flex items-center justify-center bg-slate-200 h-10 w-10 mr-3 rounded-full">
				<Fa icon={faUser} class="text-xxl text-slate-400" />
			</div>
			<div>
				<h1 class="w-32 font-medium text-slate-700 text-ellipsis whitespace-nowrap overflow-hidden">
					{data.user.firstName}
				</h1>
				<h1 class="w-32 font-medium text-slate-700 text-ellipsis whitespace-nowrap overflow-hidden">
					{data.user.lastName}
				</h1>
			</div>
		</div>
		{#each Object.entries(data.categories) as [category, pages]}
			<Divider />
			<h6 class="font-semibold text-xs text-slate-500 uppercase mt-4 mb-6">
				{category}
			</h6>
			{#each pages as link}
				{@const isActive = $page.url.pathname === link.href}
				<a
					href="{link.href}"
					class="flex items-center w-full mb-4" 
					on:click={() => isOpen = !isOpen}	
				>
					<Fa
						icon={link.icon}
						class="mr-4 text-xs {isActive ? 'text-red-500' : 'text-slate-400'}"
					/>
					<p
						class="font-semibold text-xs uppercase py-2 mr-4 w-full 
						{isActive ? 'text-red-500' : 'text-slate-600 hover:text-slate-400'}"
					>
						{link.title}
					</p>
				</a>
			{/each}
		{/each}
	</div>
</nav>

<div class="w-full overflow-y-scroll">
	<!-- Navbar -->
	<nav class="flex items-center justify-end min-w-full h-14 px-6 bg-slate-50">
		<button
			class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-200"
			on:click={() => isOpen = !isOpen}	
		>
			<Fa class="text-lg text-slate-500" icon={faBars} />
		</button>
		<h1 class="md:hidden grow text-slate-500 text-center font-semibold text-sx uppercase">
			Artilun
		</h1>
		<Menu as="div" class="relative">
			<MenuButton class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
				<Fa class="text-lg text-slate-500" icon={faUser} />
			</MenuButton>
			<MenuItems class="origin-top-right absolute right-0 rounded shadow-md p-5 w-56 bg-white">
				<h6 class="text-sm font-semibold text-slate-500 uppercase text-center">
					User Menu
				</h6>
				<Button on:click={logout} class="w-full mt-2" text="Log Out" />
			</MenuItems>
		</Menu>
	</nav>
	<!-- Children -->
	<div class="grid grid-cols-12 gap-6 p-10">
		<slot />
	</div>
</div>
