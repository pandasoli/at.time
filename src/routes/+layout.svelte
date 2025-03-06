<script lang='ts'>
	import '../app.css'
	import Header from '$lib/Header.svelte'
	
	const { children } = $props()
</script>

<Header />

<main class='app'>
	{@render children()}
</main>
