<script lang="ts">
	export let header: string
	export let variant: 'title' | 'subtitle' = 'title'

	const classMap = {
		title: 'text-lg',
		subtitle: 'text-sm'
	}
</script>

<h1 class="text-slate-700 font-bold p-6 {classMap[variant]} {$$props.class }">
	{header}
</h1>