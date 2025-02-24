<script lang='ts'>
	import { onMount } from 'svelte'
	import type { Types } from 'mongoose'
	import type { IPost } from '$lib/server/models/Post.ts'
	import PostCard from '$lib/PostCard.svelte'

	let isLoading = false
	let error: string
	let posts: IPost[] = []

	onMount(() => {
		isLoading = true

		fetch('/api/posts')
			.then(async res => {
				const obj = await res.json()

				if (res.ok) posts = obj
				else error = obj.message

				isLoading = false
			})
			.catch(e => {
				error = e
				isLoading = false
			})
	})

	const remove = (id: Types.ObjectId) =>
		posts = posts.filter(e => e._id !== id)
</script>

{#if isLoading}
	<span>Loading...</span>
{:else if error}
	<span>{error}</span>
{:else}
	<a href='/new'>New post</a>

	{#each posts as post} <PostCard {post} {remove} /> {/each}
{/if}
