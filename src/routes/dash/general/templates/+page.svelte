<script lang="ts">
    import toast from 'svelte-french-toast';
    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@rgossiaux/svelte-headlessui';
    import { page } from '$app/stores'
    import { applyAction, deserialize } from '$app/forms';
    import { invalidate } from '$app/navigation';
    import type { ActionData, PageData } from './$types'
    import Button from '../../../../components/Button.svelte'
    import Input from '../../../../components/Input.svelte'
    import Paper from '../../../../components/Paper.svelte'
    import PaperBody from '../../../../components/PaperBody.svelte'
    import PaperHeader from '../../../../components/PaperHeader.svelte'
    import TableData from '../../../../components/TableData.svelte'
    import TableHead from '../../../../components/TableHead.svelte'
    import TableRow from '../../../../components/TableRow.svelte'
    import FormError from '../../../../components/FormError.svelte';

	export let form: ActionData
	export let data: PageData

	let selectedSubject: { name: string } = data.subjects[0]

	function createTemplate(event: Event) {
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

				await invalidate('template:create')

				if (response.ok) {
					fufill(result)
				} else {
					reject(result)
				}

				applyAction(result)
			}),
			{
				loading: 'Creating...',
				success: 'Template has been created!',
				error: 'Could not create the template.',
			}
		)
	}

	function deleteTemplate(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const request = fetch('/api/general/templates/remove', {
					method: 'POST',
					body: JSON.stringify({ id, name })
				})

				const response = await request

				await invalidate('template:remove')

				if (response.ok) {
					fufill(response)
				} else {
					reject(response)
				}
			}),
			{
				loading: 'Deleting...',
				success: 'Template has been deleted!',
				error: 'Could not delete the template.',
			}
		)
	}
</script>

<Paper class="col-span-12">
	<PaperHeader
		header="Templates"
	/>
	{#if page}
		<table class="pt-4 pb-6 px-6 w-full">
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ['Template name', 'Subject', 'Action'] as header}
						<TableHead>
							{header}
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.templates.length === 0}
					<TableRow border={false}>
						<TableData colspan="2" class="text-center">
							No templates 
						</TableData>
					</TableRow>
				{/if}
				{#each Object.entries(data.templates) as [i, template]}
					<TableRow border={data.templates.length-1 !== parseInt(i)}>
						<TableData>
							{template.name}
						</TableData>
						<TableData>
							{template.subject.name}
						</TableData>
						<TableData>
							<Button label="Edit" link href="/dash/general/templates/{template.id}/edit" />
							<Button label="Delete" on:click={() => deleteTemplate(template.id)} />
						</TableData>
					</TableRow>
				{/each}
			</tbody>
		</table>
	{/if}
	<PaperBody>
		<form
			class="grid grid-cols-12 gap-4"
			method="POST"
			on:submit|preventDefault={createTemplate}
		>
			<Input
				class="col-span-7"
				placeholder="Template name"
				label="Template name"
				name="templateName"
			/>
			<input
				class="hidden"	
				name="subjectName"
				bind:value={selectedSubject.name}
			>
			<div class="col-span-4">
				<h6 class="block w-full text-xs text-slate-600 font-bold uppercase mb-1">
					Subject
				</h6>
				<Listbox
					value={selectedSubject}
					on:change={(event) => {
						selectedSubject.name = event.detail
					}}
				>
					<ListboxButton
						class="relative bg-white text-xs text-left text-slate-600 rounded p-3 w-full 
						shadow-md focus:ring-2 cursor-pointer"
					>
						{selectedSubject.name}
					</ListboxButton>
					<ListboxOptions
						class="absolute bg-white text-xs text-slate-800 rounded min-w-[15rem] h-min
						shadow-md cursor-pointer py-2 mt-1"
					>
						{#each data.subjects as subject}
							{#if subject.name !== selectedSubject.name}
								<ListboxOption
									class="px-3 py-2 text-xs text-slate-800 hover:bg-red-300"
									value={subject.name}
								>
									{subject.name}
								</ListboxOption>
							{/if}
						{/each}
					</ListboxOptions>
				</Listbox>
			</div>
			<Button class="col-span-1" label="Create" type="submit" />
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} class="mt-4" />
		{/if}
	</PaperBody>
</Paper>