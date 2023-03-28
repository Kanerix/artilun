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
				Create an account
			</h1>
			<Divider class="mb-4" />
			<form
				class="w-full grid grid-cols-2 gap-x-4 gap-y-8"
				method="POST"
			>
				<Input
					class="col-span-2 sm:col-span-1"
					label="First name"
					placeholder="First name"
					name="firstName"
				/>
				<Input
					class="col-span-2 sm:col-span-1"
					label="Last name"
					placeholder="Last name"
					name="lastName"
				/>
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
					class="col-span-2 bg-slate-800"
					text="Sign Up"
					type="sumbit"
				/>
			</form>
			{#if form?.issues}
				<FormError status={$page.status} issues={form.issues} />
			{/if}
		</Paper>
		<h1 class="mt-6">
			<a href="/login" class="text-slate-400 text-sm">Already have an account?</a>
		</h1>
	</div>
</div>
