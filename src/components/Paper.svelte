<script lang="ts">
	export let color: Color = 'white'

	type Color = 'white' | 'background' | 'error'

	function colorToCSS(color: Color) {
		switch (color) {
			case 'white':
				return 'bg-white'
			case 'background':
				return 'bg-slate-100'
			case 'error':
				return 'bg-red-500'
		}
	}
</script>

<div {...$$props} class="{colorToCSS(color)} shadow-xl rounded overflow-hidden {$$props.class}">
	<slot/>
</div>