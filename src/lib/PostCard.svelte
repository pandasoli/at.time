<script lang='ts'>
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { Types } from 'mongoose'
	import type { IPost } from '$lib/server/models/Post.ts'

	let errMsg: string|null = null
	let isLoading = false
	export let remove: (id: Types.ObjectId) => void
	export let post: IPost

	const onDelete: SubmitFunction = () => {
		isLoading = true

		return ({ result }) => {
			isLoading = false

			if (result.type === 'success')
				remove(post._id)
			else
				errMsg = (result as any).data.error
		}
	}
</script>

<div>
	<a href={`/new?edit=${post.slug}`}>{post.title}</a>

	<form action='/dashboard?/delete_post' method='POST' use:enhance={onDelete}>
		<input type='hidden' name='id' value={post._id} />
		<button disabled={isLoading}>X</button>
	</form>

	{errMsg}
</div>
