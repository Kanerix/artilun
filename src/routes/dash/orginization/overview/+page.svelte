<script lang="ts">
    import { page } from '$app/stores';
    import Button from '../../../../components/Button.svelte';
    import Input from '../../../../components/Input.svelte';
    import Paper from '../../../../components/Paper.svelte';
    import PaperBody from '../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../components/PaperHeader.svelte';
    import StatCard from '../../../../components/StatCard.svelte';
    import TableData from '../../../../components/TableData.svelte';
    import TableHead from '../../../../components/TableHead.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>


<StatCard
	header="Users"
	stat="{data.usersCount} users"
	description="Active in your orginization"
/>
<StatCard
	header="Subjects"
	stat="{data.subjects.length} subjects"
	description="Active in your orginization"
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

<Paper class="md:col-span-6 col-span-12">
	<PaperHeader header="Subjects" />
	<table class="pt-4 pb-6 px-6 w-full">
		<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
			<tr>
				{#each ["Name"] as header}
					<TableHead>
						{header}
					</TableHead>
				{/each}
			</tr>
		</thead>
		{#if page}
			<tbody>
				{#if data.subjects.length === 0}
					<tr>
						<td colspan=2 class="py-4 text-slate-500 text-center text-sm text-ellipsis">
							No subjects 
						</td>
					</tr>
				{/if}
				{#each data.subjects as subject}
					<tr>
						<TableData>
							{subject.name}
						</TableData>
						<TableData>
							<Button
								text="Cancel"
							/>
						</TableData>
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
	<PaperBody>
		<form
			class="flex"
		>
			<Input
				class="grow mr-6"
				placeholder="Subject"
				label="Subject"
				name="subject"
			/>
			<Button
				text="Add"
				type="submit"	
			/>
		</form>
	</PaperBody>
</Paper>