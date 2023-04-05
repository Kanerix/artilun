<script lang="ts">
    import { page } from '$app/stores'
    import type { ActionData } from './$types'
	import Paper from '../../components/Paper.svelte'
	import Input from '../../components/Input.svelte'
	import Button from '../../components/Button.svelte'
	import Divider from '../../components/Divider.svelte'
	import FormError from '../../components/FormError.svelte'

	export let form: ActionData

	$: form
</script>

<div class="w-full h-screen flex items-center justify-center">
	<div class="self-center w-full max-w-xl">
		<Paper color="background" class="p-4">
			<h1 class="text-sm text-slate-600 text-center font-bold mb-6 mt-4">
				Sign in to your account
			</h1>
			<Divider class="mb-4" />
			<form
				class="w-full grid grid-cols-2 gap-x-4 gap-y-8 mb-4"
				method="POST"
			>
				<Input
					class="col-span-2"
					label="Email"
					placeholder="Email"
					name="email"
				/>
				<Input
					class="col-span-2"
					label="Password"
					type="password"
					placeholder="Password"
					name="password"
				/>
				<Button
					class="col-span-2 text-xs uppercase p-3"
					label="SignIn"
					type="sumbit"
				/>
			</form>
			{#if form?.issues}
				<FormError status={$page.status} issues={form.issues} />
			{/if}
		</Paper>
		<h1 class="mt-6">
			<a href="/register" class="text-slate-400 text-sm">Don't have an account?</a>
		</h1>
	</div>
</div>
