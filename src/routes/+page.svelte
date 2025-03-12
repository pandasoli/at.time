<script lang='ts'>
	import type { IAd } from '$lib/server/models/Ad.ts'
	import type { IPost } from '$lib/server/models/Post.ts'

	export let data: { posts: IPost[], ads: IAd[] }
	const { posts, ads } = data
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
