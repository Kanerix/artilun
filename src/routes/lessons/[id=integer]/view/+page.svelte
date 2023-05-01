
<script lang="ts">
    import toast from 'svelte-french-toast';
    import Button from '../../../../components/Button.svelte';
    import type { PageData } from './$types';

	let questionIndex: number = 0

	export let data: PageData

	async function sendAnwser(rating: number) {
		if (questionIndex < data.lesson.questions.length) {
			questionIndex++
		} else {
			questionIndex = 0
		}

		if (questionIndex == data.lesson.questions.length) {
			setTimeout(() => {
				questionIndex = 0
			}, 1500)
		}

		const response = await fetch('/api/general/questions/anwser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
				questionId: data.lesson.questions[questionIndex].id,
				lessonId: data.lesson.id,
				rating
			})
		})

		if (!response.ok) {
			toast.error('Something went wrong', {
				duration: 5000,
			})
		}
	}

	$: questionIndex
</script>

<div class="col-span-12">
	<Button
		link
		href="/dash/general/lessons" 
		label="Back"
	/>
</div>

<div class="flex items-center justify-center flex-col w-full">
	{#if questionIndex < data.lesson.questions.length}
		<h1 class="text-slate-800 text-[3rem] text-center font-extrabold">
			{data.lesson.questions[questionIndex].question}
		</h1>		
		<div class="grid gap-2 grid-cols-5 mt-2">
			{#each [1, 2, 3, 4, 5] as rating}
				<button
					class="w-64 h-64 bg-slate-600"
					on:click={() => sendAnwser(rating)}
				>
					{rating}
				</button>
			{/each}
		</div>
	{:else}
		<div>
			<h1 class="text-slate-800 text-[3rem] text-center font-extrabold">
				You have finished the lesson evalutaion!
			</h1>
		</div>
	{/if}
</div>