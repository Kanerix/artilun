<script lang="ts">
    import { faXmark } from '@fortawesome/free-solid-svg-icons'
    import Fa from 'svelte-fa'
	import type { ZodIssue } from 'zod'
    import Paper from './Paper.svelte'

	function keyToLabel(key: string) {
		switch (key) {
			case 'path':
				return 'Field: '
			case 'message':
				return ''
			default:
				return 'Error'
		}
	}

	export let status: number 
	export let issues: ZodIssue[] | undefined
</script>

{#if issues}
	<Paper color="error" class="p-4 flex {$$props.class}">
		<div class="grow">
			<p class="grow text-slate-900 text-xs font-bold uppercase pb-2">
				Fejl: {status}
			</p>
			{#each issues as issue}
				<div class="my-2" />
				{#each Object.entries(issue) as [key, error]}
					{#if key === 'path' || key === 'message'}
						<p class="grow text-slate-900 text-xs font-bold">
							{keyToLabel(key)}{error}
						</p>
					{/if}
				{/each}
			{/each}
		</div>
		<button on:click={() => issues = undefined}>
			<Fa icon={faXmark} />
		</button>
	</Paper>
{/if}