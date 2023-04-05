<script lang="ts">
    import { page } from '$app/stores';
    import Paper from '../../../../../../components/Paper.svelte';
    import PaperBody from '../../../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../../../components/PaperHeader.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>

<Paper class="col-span-12">
	<PaperHeader 
		header="Questions for the current template"
	/>
	<PaperBody>
		{#if page}
			{#each data.template.questions as question}
				<p>
					{question.question}
				</p>
			{/each}
		{/if}
	</PaperBody>
</Paper>