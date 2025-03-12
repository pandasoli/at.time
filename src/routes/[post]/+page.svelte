<script lang='ts'>
	import type { IPost } from '$lib/server/models/Post.ts'
	import IconFeed from '$lib/icons/feed.svelte'

	export let data: { post: IPost }
	const { post } = data

	function formatDate(date: Date) {
		const formatter = date.toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})

		return formatter
	}
</script>

<div class='mx-auto px-4 pb-16 pt-8 md:pt-16 max-w-3xl'>
	<article>
		<header>
			<h1 class='text-4xl sm:text-6xl font-bold text-gray-800 col-span-7'>{post.title}</h1>

			<div class='text-gray-500 mt-8 text-lg border-b border-b-gray-300 mb-8 pb-8'>
				<div class='flex items-center gap-2'>
					<time datetime={post.createdAt.toString()}>{formatDate(new Date(post.createdAt))}</time>
					<IconFeed></IconFeed>
				</div>

				<ul class='mt-8 text-base text-gray-500 flex flex-wrap gap-2'>
					{#each post.tags as tag}
						<li>
							<a class='normal inline-block rounded-md border border-gray-300 px-3 py-1 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700' href='/'>{tag}</a>
						</li>
					{/each}
				</ul>
			</div>
		</header>

		<section>
			{@html post.contents}
		</section>
	</article>
</div>

<style>
	section { color: #4c4e67 }

	section :global(p) { margin-bottom: 16px }

	section :global(h2) {
		margin-top: 6rem;
		padding-bottom: 1rem;
		font-size: clamp(2rem,3vw,2.6rem);
		font-weight: 700
	}

	section :global(ul:not(.normal)) {
		list-style: disc;
		padding-left: 2rem
	}

	section :global(ul li) { font-size: 18px }

	section :global(ul li + li) { margin-top: .5rem }
</style>
