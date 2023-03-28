<script lang="ts">
	export let header: string
	export let variant: "title" | "subtitle" = "title"

	let classMap = {
		title: "text-lg",
		subtitle: "text-sm"
	}
</script>

<h1 class="text-slate-700 font-bold {classMap[variant]} {$$props.class }">
	{header}
</h1>