<script lang="ts">
    import StatCard from '../../../../components/StatCard.svelte'
    import type { PageData } from './$types';
	
	export let data: PageData

</script>

<div class="col-span-12">
	<h1 class="text-slate-800 text-[2.5rem] font-semibold">Welcome back, {data.user.name}</h1>
	<p class="text-slate-600 text-[1.25rem]">Here's your stats for {data.user.orginization}</p>
</div>

<StatCard
	header="Subjects"
	stat="{data.subjectsTeached} subjects"
	description="Teached in your lessons"
/>
<StatCard
	header="Lessons"
	stat="{data.lessonsThisWeek} lessons"
	description="Since last week"
/>
<StatCard
	header="Random"
	stat="0 random"
	description="In your orginization"
/>
<StatCard
	header="Random"
	stat="0 random"
	description="Since random time"
/>