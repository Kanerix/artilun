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
							labels: Object.keys(question.ratings),
							datasets: [{
								label: 'Anwsers',
								data: Object.values(question.ratings),
								backgroundColor: [
									'rgba(201, 32, 32, 0.2)',
									'rgba(236, 95, 17, 0.2)',
									'rgba(238, 210, 27, 0.2)',
									'rgba(86, 206, 31, 0.2)',
									'rgba(50, 149, 14, 0.2)',
								],
								borderColor: [
									'rgb(201, 32, 32)',
									'rgb(236, 95, 17)',
									'rgb(238, 210, 27)',
									'rgb(86, 206, 31)',
									'rgb(50, 149, 14)',
								],
								borderWidth: 1
							}]
						}}
						options={{ responsive: true }}
					/>
				</div>
				<div class="text-slate-600 text-sm mt-4">
					Total anwsers: {question.ratingsRaw.length}
				</div>
			</PaperBody>
		</Paper>
	{/each}
{/if}