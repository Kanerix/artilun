<script lang="ts">
    import type { ActionData } from './$types';
    import { page } from '$app/stores';
    import Button from '../../../../components/Button.svelte';
    import FormError from '../../../../components/FormError.svelte';
    import Input from '../../../../components/Input.svelte';
	import Paper from '../../../../components/Paper.svelte'
    import PaperHeader from '../../../../components/PaperHeader.svelte';
	
	export let form: ActionData

	$: form
</script>

<Paper class="lg:col-span-8 col-span-12">
	<PaperHeader
		class="p-6"
		header="Invite a user to your orginization"
	/>
	<div class="pt-4 pb-6 px-6 bg-slate-100">
		<form
			class="flex"
			method="POST"
		>
			<Input
				class="grow mr-6"
				placeholder="Email"
				label="email"
				name="email"
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
	med
</Paper>