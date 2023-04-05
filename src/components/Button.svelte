<script lang="ts">
	export let label: string
	export let color: Color = 'default'
	export let link: boolean = false 
	export let href = ''

	type Color = 'default' | 'error'

	function colorToCSS(color: Color) {
		switch (color) {
			case 'error':
				return 'bg-red-500'
			default:
				return 'bg-slate-800'
		}
	}
</script>

{#if link}
	<a
		{...$$props}
		{href}	
		on:click
		class="{colorToCSS(color)} text-white font-bold text-xs uppercase p-3 rounded focus:ring-2 shadow-md
		transition ease-in-out duration-200 hover: {$$props.class}"
	>
		{label}
	</a>
{:else}
	<button
		{...$$props}
		on:click
		class="{colorToCSS(color)} text-white font-bold text-xs uppercase p-3 rounded focus:ring-2 shadow-md
		transition ease-in-out duration-200 hover: {$$props.class}"
	>
		{label}
	</button>
{/if}