<script lang="ts">
	export let label: string = "";
</script>

<div class={$$props.class}>
	{#if label}
		<label
			for={$$props.for}
			class="block w-full text-xs text-slate-600 font-bold uppercase mb-1"
		>
			{label}
		</label>
	{/if}
	<input
		{...$$props}
		id={$$props.for}
		class="block w-full text-xs text-slate-600 p-3 shadow-md rounded focus:ring-2 placeholder:text-slate-300"
	>
</div>