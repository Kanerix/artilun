<script>

    import Paper from '../components/Paper.svelte'
    import PaperBody from '../components/PaperBody.svelte'
    import PaperHeader from '../components/PaperHeader.svelte'

</script>

<div class="flex w-full items-center justify-evenly">
	<a href="/register">
		<Paper>
			<PaperHeader
				header="Register"
			/>
			<PaperBody>
				Don't have an account?
			</PaperBody>
		</Paper>
	</a>
	<a href="/login">
		<Paper>
			<PaperHeader
				header="Login"
			/>
			<PaperBody>
				Already have an account?
			</PaperBody>
		</Paper>
	</a>
</div>