<script lang="ts">
	import toast from 'svelte-french-toast';
    import type { ActionData, PageData } from './$types';
    import { page } from '$app/stores';
    import { invalidate } from '$app/navigation';
    import Button from '../../../../components/Button.svelte';
    import FormError from '../../../../components/FormError.svelte';
    import Input from '../../../../components/Input.svelte';
	import Paper from '../../../../components/Paper.svelte'
    import PaperHeader from '../../../../components/PaperHeader.svelte';
    import PaperBody from '../../../../components/PaperBody.svelte';
    import TableData from '../../../../components/TableData.svelte';
    import TableHead from '../../../../components/TableHead.svelte';
    import { applyAction, deserialize } from '$app/forms';
	
	export let form: ActionData
	export let data: PageData

	async function kickUser(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const response = await fetch('/api/orginization/kick', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id })
				})

				invalidate('user:kick')

				if (response.ok) {
					fufill(response)
				} else {
					reject()
				}
			}),
			{
				loading: 'Kicking...',
				success: 'User has been kicked!',
				error: 'Could not kick the user.',
			}
		);
	}

	async function cancelInvite(id: number) {
		toast.promise(
			new Promise(async (fufill, reject) => {
				const response = await fetch('/api/orginization/invite/cancel', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id })
				})

				await invalidate('invite:cancel')

				if (response.ok) {
					fufill(response)
				} else {
					reject()
				}
			}),
			{
				loading: 'Cancelling...',
				success: 'Invite has been canceled!',
				error: 'Could not cancel the invite.',
			}
		);
	}

	async function inviteUser(event: Event) {
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

				await invalidate('invite:send')

				if (result.type === 'success') {
					fufill(result)
				} else {
					reject(result)
				}

				applyAction(result);
			}),
			{
				loading: 'Inviting...',
				success: 'User has been invited!',
				error: 'Could not invite the user.',
			}
		);

	}
</script>

<Paper class="lg:col-span-8 col-span-12">
	<PaperHeader
		header="Invite a user to your orginization"
	/>
	<PaperBody>
		<form
			class="flex"
			method="POST"
			on:submit|preventDefault={inviteUser}
		>
			<Input
				class="grow mr-6"
				placeholder="Email"
				label="email"
				name="email"
			/>
			<Button
				type="submit"
				text="Invite"
				class="bg-slate-800"
			/>
		</form>
		{#if form?.issues}
			<FormError status={$page.status} issues={form.issues} class="mt-4" />
		{/if}
	</PaperBody>
</Paper>
<Paper class="lg:col-span-4 col-span-12">
	<PaperHeader header="Invited users" />
	<table class="pt-4 pb-6 px-6 w-full">
		<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
			<tr>
				{#each ["Email", "Action"] as header}
					<TableHead>
						{header}
					</TableHead>
				{/each}
			</tr>
		</thead>
		{#if page}
			<tbody>
				{#if data.invites.length === 0}
					<tr>
						<td colspan=2 class="py-4 text-slate-500 text-center text-sm text-ellipsis">
							No active invites
						</td>
					</tr>
				{/if}
				{#each data.invites as invite}
					<tr>
						<TableData>
							{invite.email}
						</TableData>
						<TableData>
							<Button
								text="Cancel"
								on:click={() => cancelInvite(invite.id)}
							/>
						</TableData>
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</Paper>
<Paper class="col-span-12">
	<PaperHeader header="Users in your orginization" />
	<table class="pt-4 pb-6 px-6 w-full">
		<thead {...$$props} class="bg-slate-100 border-y border-slate-200">
			<tr>
				{#each ["First name", "Last name", "Email", "Role", "Action"] as header}
					<TableHead>
						{header}
					</TableHead>
				{/each}
			</tr>
		</thead>
		{#if page}
			<tbody>
				{#if data.userTableData.length === 0}
				<tr>
					<td colspan=5 class="py-4 text-slate-500 text-center text-sm text-ellipsis">
						No users
					</td>
				</tr>
				{/if}
				{#each data.userTableData as user}
					<tr>
						<TableData>
							{user.firstName}
						</TableData>
						<TableData>
							{user.lastName}
						</TableData>
						<TableData>
							{user.email}
						</TableData>
						<TableData>
							{user.role}
						</TableData>
						<TableData>
							<Button
								text="Kick"
								on:click={() => kickUser(user.id)}
							/>
						</TableData>
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</Paper>