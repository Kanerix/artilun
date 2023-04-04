<script lang="ts">
	export let text = 'default'
	export let color: Color = 'default'

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

<button
	{...$$props}
	on:click
	class="{colorToCSS(color)} text-white font-bold text-xs uppercase p-3 rounded focus:ring-2 shadow-md
	transition ease-in-out duration-200 hover: {$$props.class}"
>
	{text}
</button>