<script lang="ts">
    import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@rgossiaux/svelte-headlessui';
    import toast from 'svelte-french-toast';
    import { page } from '$app/stores'
    import { applyAction, deserialize } from '$app/forms';
    import { invalidate } from '$app/navigation';
    import type { ActionData, PageData } from './$types'
    import Button from '../../../../components/Button.svelte'
    import Input from '../../../../components/Input.svelte'
    import Paper from '../../../../components/Paper.svelte'
    import PaperBody from '../../../../components/PaperBody.svelte'
    import PaperHeader from '../../../../components/PaperHeader.svelte'
    import Table from '../../../../components/Table.svelte';
    import TableData from '../../../../components/TableData.svelte'
    import TableHead from '../../../../components/TableHead.svelte'
    import TableRow from '../../../../components/TableRow.svelte'
    import FormError from '../../../../components/FormError.svelte';

	export let form: ActionData
	export let data: PageData

	let selectedTemplate = { ...data.templates[0] }
	let selectedTemplateName: string = selectedTemplate.name

	function createLesson(event: Event) {
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

				await invalidate('lesson:create')

				if (result.type === 'success') {
					fufill(result)
				} else {
					reject(result)
				}

				applyAction(result)
			}),
			{
				loading: 'Creating...',
				success: 'Lesson has been created!',
				error: 'Could not create the lesson.',
			}
		)
	}

	function deleteLesson(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const request = fetch('/api/general/lessons/delete', {
					method: 'POST',
					body: JSON.stringify({ id })
				})

				const response = await request

				await invalidate('lesson:delete')

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
		header="Lessons"
	/>
	{#if page}
		<Table>
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ['Lesson name', 'Template name', 'subject', 'Action'] as header}
						<TableHead>
							{header}
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.lessons.length === 0}
					<TableRow border={false}>
						<TableData colspan=4 class="text-center">
							No templates 
						</TableData>
					</TableRow>
				{/if}
				{#each Object.entries(data.lessons) as [i, lesson]}
					<TableRow border={data.lessons.length-1 !== parseInt(i)}>
						<TableData>
							{lesson.name}
						</TableData>
						<TableData>
							{lesson.standTemplate.name}
						</TableData>
						<TableData>
							{lesson.subject.name}
						</TableData>
						<TableData>
							<Button
								label="Start" link href="/lessons/{lesson.id}/view"
							/>
							<Button
								label="Data" link href="/dash/general/lessons/{lesson.id}/data"
							/>
							<Button label="Delete" color="error" on:click={() => deleteLesson(lesson.id)} />
						</TableData>
					</TableRow>
				{/each}
			</tbody>
		</Table>
	{/if}
	<PaperBody>
		<form
			class="grid grid-cols-12 gap-4"
			method="POST"
			on:submit|preventDefault={createLesson}
		>
			<Input
				class="col-span-12 lg:col-span-6 xl:col-span-7"
				placeholder="Lesson name"
				label="lesson name"
				name="lessonName"
			/>
			<input
				class="hidden"	
				name="subjectId"
				type=number
				bind:value={selectedTemplate.subject.id}
				min={0}
			>
			<input
				class="hidden"
				name="templateId"
				type=number
				bind:value={selectedTemplate.id}
				min={0}
			>
			<div class="col-span-12 lg:col-span-4">
				<h6 class="block w-full text-xs text-slate-600 font-bold uppercase mb-1">
					Template
				</h6>
				<Listbox
					value={selectedTemplateName}
					on:change={(event) => {
						selectedTemplateName = event.detail
					}}
				>
					<ListboxButton
						class="relative bg-white text-xs text-left text-slate-600 rounded p-3 w-full 
						shadow-md focus:ring-2 cursor-pointer"
					>
						{selectedTemplateName}
					</ListboxButton>
					<ListboxOptions
						class="absolute bg-white text-xs text-slate-800 rounded min-w-[15rem] h-min
						shadow-md cursor-pointer py-2 mt-1"
					>
						{#each data.templates as template}
							<ListboxOption
								class="px-3 py-2 text-xs text-slate-800 hover:bg-red-300"
								on:click={() => {
									selectedTemplate = template
								}}
								value={template.name}
							>
								{template.name} - {template.subject.name}
							</ListboxOption>
						{/each}
					</ListboxOptions>
				</Listbox>
			</div>
			<Button class="col-span-12 lg:col-span-2 xl:col-span-1" label="Create" type="submit" />
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} class="mt-4" />
		{/if}
	</PaperBody>
</Paper>