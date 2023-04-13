<script lang="ts">
	// @ts-ignore
	import Chart from 'chart.js/auto';
	import { Bar } from 'svelte-chartjs';
    import { page } from '$app/stores';
    import Paper from '../../../../../../components/Paper.svelte';
    import PaperBody from '../../../../../../components/PaperBody.svelte';
    import PaperHeader from '../../../../../../components/PaperHeader.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>

{#if page}
	{#each Object.values(data.lesson.questions) as question}
		<Paper class="col-span-6">
			<PaperHeader 
				header={question.question}
			/>
			<PaperBody>
				<div class="flex flex-col">
					<Bar
						data={{
							labels: ['1 star', '2 star', '3 star', '4 star', '5 star'],
							datasets: [{
								label: "Rating",
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
			</PaperBody>
		</Paper>
	{/each}
{/if}