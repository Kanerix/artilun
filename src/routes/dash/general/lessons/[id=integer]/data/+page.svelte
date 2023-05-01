<script lang="ts">
	// @ts-ignore @eslint-ignore
	import Chart from 'chart.js/auto'
	import { Bar } from 'svelte-chartjs'
    import { page } from '$app/stores'
    import Paper from '../../../../../../components/Paper.svelte'
    import PaperBody from '../../../../../../components/PaperBody.svelte'
    import PaperHeader from '../../../../../../components/PaperHeader.svelte'
    import type { PageData } from './$types'
    import Button from '../../../../../../components/Button.svelte';

	export let data: PageData

</script>

<div class="col-span-12">
	<Button
		link
		href="/dash/general/lessons" 
		label="Back"
	/>
</div>

{#if page}
	{#each Object.values(data.lesson.questions) as question}
		<Paper class="col-span-12 md:col-span-6">
			<PaperHeader 
				header={question.question}
			/>
			<PaperBody>
				<div class="flex flex-col">
					<Bar
						data={{
							labels: ['Very bad', 'Bad', 'Mediocre', 'Good', 'Very good'],
							datasets: [{
								label: 'Anwsers',
								data: question.ratings,
								backgroundColor: [
									'rgba(255, 99, 132, 0.2)',
								],
								borderColor: [
									'rgb(255, 99, 132)',
								],
								borderWidth: 1
							}]
						}}
						options={{ responsive: true }}
					/>
				</div>
				<div class="text-slate-600 text-sm mt-4">
					Total anwsers: {question.ratings.length}
				</div>
			</PaperBody>
		</Paper>
	{/each}
{/if}