<script>
    import { Toaster } from 'svelte-french-toast';
	import '../app.css'
</script>

<div class="flex direction-col h-screen">
	<slot/>
</div>

<Toaster />