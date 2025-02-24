<script lang='ts'>
	import { page } from '$app/state'
	import type { IPost } from '$lib/server/models/Post.ts'

	const post: IPost = page.data.post
</script>

<section>
	<span>{post.title}</span>

	{@html post.contents}
</section>
