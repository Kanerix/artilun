<script lang="ts">
    import { page } from '$app/stores';
    import type { PageData } from './$types';
    import Button from '../../../../components/Button.svelte';
    import Input from '../../../../components/Input.svelte';
    import Paper from '../../../../components/Paper.svelte';
    import PaperBody from '../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../components/PaperHeader.svelte';
    import TableData from '../../../../components/TableData.svelte';
    import TableHead from '../../../../components/TableHead.svelte';
    import TableRow from '../../../../components/TableRow.svelte';

	export let data: PageData

</script>

<Paper class="col-span-12">
	<PaperHeader
		header="Templates"
	/>
	{#if page}
		<table class="pt-4 pb-6 px-6 w-full">
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ['Template name', 'Action'] as header}
						<TableHead>
							{header}
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.templates.length === 0}
					<TableRow border={false}>
						<TableData colspan=2 class="text-center">
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
							<Button label="Edit" link href="/dash/general/templates/{template.id}/edit" />
							<Button label="Delete" />
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
				placeholder="Template name"
				label="Template"
				name="template"
			/>
			<Button label="Add" type="submit" />
		</form>
	</PaperBody>
</Paper>