<script lang='ts'>
	import { page } from '$app/state'

	const posts = page.data.posts
	const ads = page.data.ads
</script>

<section class='px-2 py-4'>
	<ul>
		{#each posts as post}
			<li><a href={`/${post.slug}`}>{post.title}</a></li>
		{/each}
	</ul>

	<hr />

	{#each ads as ad}
		<a href={ad.redirect_url}>
			<img src={ad.image_url} alt='Ad' />
		</a>
	{/each}
</section>
