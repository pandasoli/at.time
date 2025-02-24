<script lang='ts'>
	import '../app.css'
	
	const { children } = $props()
</script>

<main class='app'>
	{@render children()}
</main>
