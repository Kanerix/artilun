<script lang="ts">
    import toast from 'svelte-french-toast'
    import type { ActionData, PageData } from './$types'
    import { page } from '$app/stores'
    import { invalidate } from '$app/navigation'
    import Button from '../../../components/Button.svelte'
    import FormError from '../../../components/FormError.svelte'
    import Input from '../../../components/Input.svelte'
    import Paper from '../../../components/Paper.svelte'
    import PaperHeader from '../../../components/PaperHeader.svelte'
    import TableData from '../../../components/TableData.svelte'
    import TableHead from '../../../components/TableHead.svelte'
    import PaperBody from '../../../components/PaperBody.svelte'
    import TableRow from '../../../components/TableRow.svelte'
    import Table from '../../../components/Table.svelte';

	export let form: ActionData
	export let data: PageData

	function acceptInvite(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const response = await fetch('/api/orginization/invite/accept', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ id })
				})

				await invalidate('invite:accept')

				if (response.ok) {
					fufill(response)
				} else {
					reject()
				}

			}),
			{
				loading: 'Accepting...',
				success: 'You joined the orginization!',
				error: 'Could not join the orginization.',
			}
		)
	}
</script>

<Paper class="lg:col-span-8 col-span-12">
	<PaperHeader
		class="p-6"
		header="Create a new orginization"
	/>
	<PaperBody>
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
				label="Create"
			/>
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} class="mt-4" />
		{/if}
	</PaperBody>
</Paper>
<Paper class="lg:col-span-4 col-span-12">
	<PaperHeader
		header="Orginization invites"
	/>
	{#if page}
		<Table>
			<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
				<TableRow>
					{#each ['Orginization', 'Action'] as header}
						<TableHead>
							{header}	
						</TableHead>
					{/each}
				</TableRow>
			</thead>
			<tbody>
				{#if data.invites.length === 0}
					<TableData colspan=2 class="text-center">
						No invites
					</TableData>
				{/if}
				{#each data.invites as invite}
					<TableRow>
						<TableData>
							{invite.orginization.name}
						</TableData>
						<TableData>
							<Button
								label="Accept"
								on:click={() => acceptInvite(invite.id)}
							/>
						</TableData>
					</TableRow>
				{/each}
			</tbody>
		</Table>
	{/if}
</Paper>