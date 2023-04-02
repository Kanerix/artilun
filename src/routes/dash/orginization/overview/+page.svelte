<script lang="ts">
    import Paper from '../../../../components/Paper.svelte';
    import PaperBody from '../../../../components/PaperBody.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>


<Paper class="lg:col-span-3 sm:col-span-6 col-span-12">
	<PaperBody>
		<div>
			<h6 class="text-sm text-slate-400 font-semibold uppercase">
				Users
			</h6>
			<h4 class="text-xl text-slate-700 font-medium uppercase mt-1">
				{data.usersCount} users
			</h4>
			<h4 class="text-sm text-slate-400 mt-4">
				Active in your orginization	
			</h4>
		</div>
	</PaperBody>
</Paper>
<Paper class="lg:col-span-3 sm:col-span-6 col-span-12">
	<PaperBody>
		<div>
			<h6 class="text-sm text-slate-400 font-semibold uppercase">
				Subjects
			</h6>
			<h4 class="text-xl text-slate-700 font-medium uppercase mt-1">
				{data.subjectsCount} subjects
			</h4>
			<h4 class="text-sm text-slate-400 mt-4">
				Teached in your orginization
			</h4>
		</div>
	</PaperBody>
</Paper>
<Paper class="lg:col-span-3 sm:col-span-6 col-span-12">
	<PaperBody>
		<div>
			<h6 class="text-sm text-slate-400 font-semibold uppercase">
				Lessons
			</h6>
			<h4 class="text-xl text-slate-700 font-medium uppercase mt-1">
				{data.lessonsCount} lessons
			</h4>
			<h4 class="text-sm text-slate-400 mt-4">
				Since last week
			</h4>
		</div>
	</PaperBody>
</Paper>
<Paper class="lg:col-span-3 sm:col-span-6 col-span-12">
	<PaperBody>
		<div>
			<h6 class="text-sm text-slate-400 font-semibold uppercase">
				Random
			</h6>
			<h4 class="text-xl text-slate-700 font-medium uppercase mt-1">
				0 random
			</h4>
			<h4 class="text-sm text-slate-400 mt-4">
				Since some random time
			</h4>
		</div>
	</PaperBody>
</Paper>