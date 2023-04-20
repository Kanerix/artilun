<script>
    import Paper from '../components/Paper.svelte'
    import PaperBody from '../components/PaperBody.svelte'
    import PaperHeader from '../components/PaperHeader.svelte'
</script>

<div class="w-full h-screen">
	<img 
		class="h-[50%] w-full object-cover"
		src="/itu.jpg"	
		alt="ITU"
	/>
	<div class="grid grid-cols-1 md:grid-cols-3 lg:mx-[5rem] items-center gap-4 transform -translate-y-1/2">
		<Paper class="max-w-sm">
			<PaperHeader
				header="Login"
			/>
			<PaperBody>
				<a href="/login" class="text-md text-slate-600 underline mb-4">
					Already have an account?
				</a>
			</PaperBody>
		</Paper>
		<Paper class="max-w-sm">
			<PaperHeader
				header="Register"
			/>
			<PaperBody>
				<a href="/register" class="text-md text-slate-600 underline mb-4">
					Already have an account?
				</a>
			</PaperBody>
		</Paper>
		<Paper class="max-w-sm">
			<PaperHeader
				header="Contact"
			/>
			<PaperBody>
				<a href="/contact" class="text-md text-slate-600 underline mb-4">
					Wanna get in touch?
				</a>
			</PaperBody>
		</Paper>
	</div>
</div>