<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { page } from '$app/stores';
    import Button from '../../../components/Button.svelte';
    import FormError from '../../../components/FormError.svelte';
    import Input from '../../../components/Input.svelte';
    import Paper from '../../../components/Paper.svelte';
    import PaperHeader from '../../../components/PaperHeader.svelte';
    import TableHead from '../../../components/TableHead.svelte';

	export let form: ActionData
	export let data: PageData
</script>

<Paper class="lg:col-span-8 col-span-12">
	<PaperHeader
		class="p-6"
		header="Create a new orginization"
	/>
	<div class="pt-4 pb-6 px-6 h-full bg-slate-100">
		<form
			class="flex"
			method="POST"
		>
			<Input
				class="grow mr-6"
				placeholder="Name"
				label="Name"
				name="name"
			/>
			<Button
				type="submit"
				text="Create"
				class="bg-slate-800"
			/>
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} class="mt-4" />
		{/if}
	</div>
</Paper>
<Paper class="lg:col-span-4 col-span-12">
	<PaperHeader
		class="p-6"
		header="Orginization invites"
	/>
	<table class="pt-4 pb-6 px-6 w-full table-fixed">
		<TableHead headers={["Orginization", "Action"]} />
		{#if page}
			<tbody>
				{#if data.invites.length === 0}
					<td colspan=2 class="py-4 text-slate-500 text-center text-sm text-ellipsis">
						No invites
					</td>
				{/if}
				{#each data.invites as invite}
					<tr>
						<td colspan=1 class="py-2 pl-4 truncate">
							{invite.orginization.name}
						</td>
						<td colspan=1 class="py-2 text-center">
							<Button text="Accept" />
						</td>
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</Paper>