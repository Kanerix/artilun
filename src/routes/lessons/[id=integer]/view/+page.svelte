
<script lang="ts">
    import toast from 'svelte-french-toast';
    import type { PageData } from './$types';
    import Button from '../../../../components/Button.svelte';

	let questionIndex: number = 0

	export let data: PageData

	async function sendAnwser(rating: number) {
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

		if (questionIndex < data.lesson.questions.length) {
			questionIndex++
		} else {
			questionIndex = 0
		}

		if (questionIndex == data.lesson.questions.length) {
			setTimeout(() => {
				questionIndex = 0
			}, 850)
		}
	}

	const ratingImages = [
		'/smileys/smiley-very-bad.svg',
		'/smileys/smiley-bad.svg',
		'/smileys/smiley-mid.svg',
		'/smileys/smiley-good.svg',
		'/smileys/smiley-very-good.svg',
	]

	$: questionIndex

</script>

<div class="flex items-center justify-around flex-col w-full">
	{#if questionIndex < data.lesson.questions.length}
		<h4 class="text-slate-800 text-[1.5rem] text-center font-semibold">
			{questionIndex + 1}/{data.lesson.questions.length}
		</h4>		
		<div class="w-full">
			<h1
				class="text-slate-800 text-center font-extrabold
				text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem]"
			>
				{data.lesson.questions[questionIndex].question}
			</h1>
			<div class="flex justify-around items-between mt-6 w-full">
				{#each [1, 2, 3, 4, 5] as rating}
				{@const ratingImage = ratingImages[rating - 1]}
					<button
						class="w-12 h-12 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-48 lg:h-58 xl:w-60 xl:h-60"
						on:click={() => sendAnwser(rating)}
					>
						<img src={ratingImage} alt="rating" />
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<div>
			<h1 class="text-slate-800 text-[4rem] text-center font-extrabold mb-8">
				Thank you!
			</h1>
			<h1 class="text-slate-800 text-[3rem] text-center font-extrabold">
				You have finished the lesson evalutaion!
			</h1>
		</div>
	{/if}
	<div>
		<Button
			label="End"
			link
			href="/dash/general/lessons"
		/>
	</div>
</div>