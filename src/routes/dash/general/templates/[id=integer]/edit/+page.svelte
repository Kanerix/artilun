<script lang="ts">
    import { page } from '$app/stores'
    import type { ActionData, PageData } from './$types'
    import Button from '../../../../../../components/Button.svelte'
    import Input from '../../../../../../components/Input.svelte'
    import Paper from '../../../../../../components/Paper.svelte'
    import PaperHeader from '../../../../../../components/PaperHeader.svelte'
    import TableRow from '../../../../../../components/TableRow.svelte';
    import TableData from '../../../../../../components/TableData.svelte';
    import TableHead from '../../../../../../components/TableHead.svelte';
    import PaperBody from '../../../../../../components/PaperBody.svelte';
    import FormError from '../../../../../../components/FormError.svelte';
    import toast from 'svelte-french-toast';
    import { applyAction, deserialize } from '$app/forms';
    import { invalidate } from '$app/navigation';
    import Fa from 'svelte-fa';
    import { faClose } from '@fortawesome/free-solid-svg-icons';
    import Table from '../../../../../../components/Table.svelte';

	export let form: ActionData
	export let data: PageData

	function createQuestion(event: Event) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const form = event.target as HTMLFormElement
				const data = new FormData(form)
				const request = fetch(form.action, {
					method: 'POST',
					body: data
				})

				const response = await request
				const result = deserialize(await response.text())

				await invalidate('question:create')

				if (result.type === 'success') {
					fufill(result)
				} else {
					reject(result)
				}

				applyAction(result)
			}),
			{
				loading: 'Creating...',
				success: 'Question has been created!',
				error: 'Could not create the question.',
			}
		)
	}

	function deleteQuestion(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const response = await fetch('/api/general/templates/questions/delete', {
					method: 'POST',
					body: JSON.stringify({ id })
				})

				await invalidate('question:delete')

				if (response.ok) {
					fufill(response)
				} else {
					reject(response)
				}
			}),
			{
				loading: 'Removing...',
				success: 'Question has been deleted!',
				error: 'Could not remove the question.',
			}
		)
	}
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
	{#if page}
		<Table>
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ['Question'] as header}
						<TableHead>
							{header}
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.template.questions.length === 0}
					<TableRow border={false}>
						<TableData colspan=1 class="text-center">
							No questions yet 
						</TableData>
					</TableRow>
				{/if}
				{#each Object.entries(data.template.questions) as [i, question]}
					<TableRow border={data.template.questions.length-1 !== parseInt(i)}>
						<TableData class="flex items-center">
							<p class="grow">
								{question.question}
							</p>
							<button
								class="bg-slate-200 w-6 h-6 rounded-full border border-slate-300"
								on:click={() => deleteQuestion(question.id)}
							>
								<Fa icon={faClose} class="m-auto" />
							</button>
						</TableData>
					</TableRow>
				{/each}
			</tbody>
		</Table>
	{/if}
	<PaperBody>
		<form
			class="flex"
			method="POST"
			on:submit|preventDefault={createQuestion}
		>
			<Input
				class="grow mr-6"
				placeholder="Question"
				label="Question"
				name="question"
			/>
			<Button class="col-span-1" label="Create" type="submit" />
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} class="mt-4" />
		{/if}
	</PaperBody>
</Paper>