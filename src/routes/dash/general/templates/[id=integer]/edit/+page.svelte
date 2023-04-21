<script lang="ts">
    import { page } from '$app/stores'
    import type { PageData } from './$types'
    import Button from '../../../../../../components/Button.svelte'
    import Paper from '../../../../../../components/Paper.svelte'
    import PaperBody from '../../../../../../components/PaperBody.svelte'
    import PaperHeader from '../../../../../../components/PaperHeader.svelte'

	export let data: PageData

</script>

<div class="col-span-12">
	<Button
		link
		href="/dash/general/templates" 
		label="Back"
	/>
</div>

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