<script lang="ts">
    import { applyAction, deserialize } from '$app/forms';
    import { invalidate } from '$app/navigation';
    import { page } from '$app/stores';
    import toast from 'svelte-french-toast';
    import type { ActionData, PageData } from './$types';
    import Button from '../../../../components/Button.svelte';
    import Input from '../../../../components/Input.svelte';
    import Paper from '../../../../components/Paper.svelte';
    import PaperBody from '../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../components/PaperHeader.svelte';
    import StatCard from '../../../../components/StatCard.svelte';
    import TableData from '../../../../components/TableData.svelte';
    import TableHead from '../../../../components/TableHead.svelte';
    import FormError from '../../../../components/FormError.svelte';
    import Fa from 'svelte-fa';
    import { faClose } from '@fortawesome/free-solid-svg-icons';
    import TableRow from '../../../../components/TableRow.svelte';

	export let data: PageData
	export let form: ActionData

	async function addSubject(event: Event) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const form = event.target as HTMLFormElement
				const data = new FormData(form);
				const request = fetch(form.action, {
					method: 'POST',
					body: data
				});

				const response = await request
				const result = deserialize(await response.text());

				await invalidate('subject:add')

				if (result.type === 'success') {
					fufill(result)
				} else {
					reject(result)
				}

				applyAction(result);
			}),
			{
				loading: 'Adding...',
				success: 'Subject has been added!',
				error: 'Could not add the subject.',
			}
		);
	}

	async function removeSubject(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const response = await fetch('/api/orginization/subject/remove', {
					method: 'POST',
					body: JSON.stringify({ id })
				});

				await invalidate('subject:remove')

				if (response.ok) {
					fufill(response)
				} else {
					reject(response)
				}
			}),
			{
				loading: 'Removing...',
				success: 'Subject has been removed!',
				error: 'Could not remove the subject.',
			}
		);
	}
</script>


<StatCard
	header="Users"
	stat="{data.usersCount} users"
	description="Active in your orginization"
/>
<StatCard
	header="Subjects"
	stat="{data.subjects.length} subjects"
	description="Teached in your orginization"
/>
<StatCard
	header="Lessons"
	stat="{data.lessonsCount} lessons"
	description="Since last week"
/>
<StatCard
	header="Random"
	stat="{data.usersCount} random"
	description="Since random time"
/>

<Paper class="lg:col-span-6 col-span-12">
	<PaperHeader header="Subjects" />
	{#if page}
		<table class="pt-4 pb-6 px-6 w-full">
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ["Name"] as header}
						<TableHead>
							{header}
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.subjects.length === 0}
					<TableRow border={false}>
						<TableData colspan=2 class="text-center">
							No subjects 
						</TableData>
					</TableRow>
				{/if}
				{#each Object.entries(data.subjects) as [i, subject]}
					<TableRow border={data.subjects.length-1 !== parseInt(i)}>
						<TableData class="flex items-center">
							<p class="grow">
								{subject.name}
							</p>
							<button
								class="bg-slate-200 w-6 h-6 rounded-full border border-slate-300"
								on:click={() => removeSubject(subject.id)}
							>
								<Fa icon={faClose} class="m-auto" />
							</button>
						</TableData>
					</TableRow>
				{/each}
			</tbody>
		</table>
	{/if}
	<PaperBody>
		<form
			class="flex mb-4"
			method="POST"
			on:submit|preventDefault={addSubject}
		>
			<Input
				class="grow mr-6"
				placeholder="Subject"
				label="Subject"
				name="subject"
			/>
			<Button text="Add" type="submit" />
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} />
		{/if}
	</PaperBody>
</Paper>