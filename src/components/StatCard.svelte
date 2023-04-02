<script lang="ts">
    import Paper from './Paper.svelte'

	export let header: string
	export let stat: string
	export let description: string

</script>

<Paper class="lg:col-span-3 sm:col-span-6 col-span-12 p-4">
	<h6 class="text-sm text-slate-400 font-semibold uppercase">
		{header}
	</h6>
	<h4 class="text-xl text-slate-700 font-medium uppercase mt-1">
		{stat}
	</h4>
	<h4 class="text-sm text-slate-400 mt-4">
		{description}
	</h4>
</Paper>