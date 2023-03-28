<script lang="ts">
	export let headers: string[]
</script>

<thead {...$$props} class="bg-slate-100 {$$props.class}">
	<tr>
		{#each headers as header}
			<th class="py-2">{header}</th>
		{/each}
	</tr>
</thead>