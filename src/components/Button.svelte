<script lang="ts">
	export let text: string | undefined
</script>

<button
	{...$$props}
	class="bg-red-500 text-white font-bold text-xs uppercase p-3 rounded focus:ring-2 shadow-md
	transition ease-in-out duration-200 hover: {$$props.class}"
>
	{text}
</button>