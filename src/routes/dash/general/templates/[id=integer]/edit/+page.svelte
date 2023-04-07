<script lang="ts">
    import { page } from '$app/stores';
    import Button from '../../../../../../components/Button.svelte';
    import Paper from '../../../../../../components/Paper.svelte';
    import PaperBody from '../../../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../../../components/PaperHeader.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>

<Button
	link
	href="/dash/general/templates" 
	label="Back"
/>

<Paper class="col-span-12">
	<PaperHeader 
		header="Questions for the current template"
	/>
	<PaperBody>
		{#if page}
			{#if data.template.questions.length === 0}
				<p>
					No questions have been added to this template yet.
				</p>
			{/if}
			{#each data.template.questions as question}
				<p>
					{question.question}
				</p>
			{/each}
		{/if}
	</PaperBody>
</Paper>