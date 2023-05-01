
<script lang="ts">
    import Button from '../../../../components/Button.svelte';
    import type { PageData } from './$types';

	let questionIndex: number = 0

	export let data: PageData

	$: questionIndex
</script>

<div class="col-span-12">
	<Button
		link
		href="/dash/general/lessons" 
		label="Back"
	/>
</div>

<div>
	<div>
		<h1>
			{data.lesson.questions[questionIndex].question}
		</h1>		
	</div>
	<div>
		{#each ['A', 'B', 'C', 'D', 'E'] as label}
			<button
				on:click={() => questionIndex++}
			>
				{label}
			</button>
		{/each}
	</div>
</div>