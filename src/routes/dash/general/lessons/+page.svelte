<script lang="ts">
    import { page } from '$app/stores';
    import Button from '../../../../components/Button.svelte';
    import Input from '../../../../components/Input.svelte';
    import Paper from '../../../../components/Paper.svelte';
    import PaperBody from '../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../components/PaperHeader.svelte';
    import TableData from '../../../../components/TableData.svelte';
    import TableHead from '../../../../components/TableHead.svelte';
    import TableRow from '../../../../components/TableRow.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>

<Button
	link
	href="/dash/general/lessons" 
	label="Back"
/>

<Paper class="col-span-12">
	<PaperHeader
		header="Lessons"
	/>
	{#if page}
		<table class="pt-4 pb-6 px-6 w-full table-auto">
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ['Lesson name', 'subject', 'Action'] as header}
						<TableHead>
							{header}
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.lessons.length === 0}
					<TableRow border={false}>
						<TableData colspan=2 class="text-center">
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
							{lesson.subject}
						</TableData>
						<TableData>
							<Button
								label="View"
								link
								href="/dash/general/lessons/{lesson.id}/data"
								class="rounded-tr-none"
							/>
							<Button
								label="Delete"
								class="rounded-tl-none"
							/>
						</TableData>
					</TableRow>
				{/each}
			</tbody>
		</table>
	{/if}
	<PaperBody>
		<form class="flex">
			<Input
				class="grow mr-6"
				placeholder="Lesson name"
				label="Lesson"
				name="lesson"
			/>
			<Button label="Add" type="submit" />
		</form>
	</PaperBody>
</Paper>