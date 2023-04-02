<script lang="ts">
    import toast from 'svelte-french-toast';
    import type { ActionData, PageData } from './$types';
    import { page } from '$app/stores';
    import Button from '../../../components/Button.svelte';
    import FormError from '../../../components/FormError.svelte';
    import Input from '../../../components/Input.svelte';
    import Paper from '../../../components/Paper.svelte';
    import PaperHeader from '../../../components/PaperHeader.svelte';
    import TableData from '../../../components/TableData.svelte';
    import TableHead from '../../../components/TableHead.svelte';
    import PaperBody from '../../../components/PaperBody.svelte';
    import { invalidate } from '$app/navigation';

	export let form: ActionData
	export let data: PageData

	async function acceptInvite(id: number) {
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
		);
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
				text="Create"
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
	<table class="pt-4 pb-6 px-6 w-full">
		<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
			<tr>
				{#each ["Orginization", "Action"] as header}
					<TableHead>
						{header}	
					</TableHead>
				{/each}
			</tr>
		</thead>
		{#if page}
			<tbody>
				{#if data.invites.length === 0}
					<td colspan=2 class="py-4 text-slate-500 text-center text-sm text-ellipsis">
						No invites
					</td>
				{/if}
				{#each data.invites as invite}
					<tr>
						<TableData>
							{invite.orginization.name}
						</TableData>
						<TableData>
							<Button
								text="Accept"
								class="bg-slate-800"
								on:click={() => acceptInvite(invite.id)}
							/>
						</TableData>
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</Paper>