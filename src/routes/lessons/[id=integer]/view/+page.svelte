
<script lang="ts">
    import Button from '../../../../components/Button.svelte';
    import type { PageData } from './$types';

	export let data: PageData

</script>

<div class="col-span-12">
	<Button
		link
		href="/dash/general/lessons" 
		label="Back"
	/>
</div>