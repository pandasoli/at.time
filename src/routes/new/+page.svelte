<script lang='ts'>
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { IPost } from '$lib/server/models/Post.ts'
	import type Quill from 'quill'
	import TagSelector from '$lib/TagSelector.svelte'

	let isCreating = false
	let errMsg: string|null = null

	let title: string = ''
	let description: string = ''
	let author: string = ''
	let tags: string[] = []
	let editor: Quill|null

	const editingPost: IPost|null = page.data.editingPost
	const allTags: string[] = page.data.allTags

	onMount(async () => {
		const Quill = (await import('quill')).default
		const node = document.getElementById('editor')!

		const toolbar = [
			['bold', 'italic', 'underline'],
			['blockquote', 'code-block'],
			['link', 'image', 'video'],

			[{ 'script': 'sub'}, { 'script': 'super' }],
			[{ 'header': [1, 2, 3, false] }],
			[{ 'align': [] }]
		]

		editor = new Quill(node, {
			modules: { toolbar },
			placeholder: 'Type something...',
			theme: 'snow'
		})

		if (editingPost) {
			title = editingPost.title
			description = editingPost.description
			author = editingPost.author
			tags = editingPost.tags
			editor.root.innerHTML = editingPost.contents
		}
	})

	const updateTags = (n: string[]) =>
		tags = [...n]

	const onSubmit: SubmitFunction = async ({ formData }) => {
		isCreating = true

		const contents = editor?.getSemanticHTML() ?? ''

		formData.set('contents', contents)
		tags.forEach(tag => formData.append('tags', tag))

		if (editingPost)
			formData.set('slug', editingPost?.slug ?? '')

		return async ({ update, result }) => {
			await update()

			isCreating = false
			const didFail = !['success', 'redirect'].includes(result.type)

			if (didFail)
				return errMsg = (result as any).data.error

			if (!editingPost) {
				errMsg = ''
				title = ''
				description = ''
				author = ''
				tags = []
				editor!.root.innerHTML = ''
			}
		}
	}
</script>

<svelte:head>
	<link href='//cdn.quilljs.com/1.3.6/quill.snow.css' rel='stylesheet' />
</svelte:head>

<section>
	<form action={`/new?/${editingPost ? 'update' : 'create'}`} method='POST' use:enhance={onSubmit}>
		<input required type='text' name='title'       bind:value={title}       placeholder='Title' />
		<input required type='text' name='description' bind:value={description} placeholder='Description' />
		<input required type='text' name='author'      bind:value={author}      placeholder='Author' />
		<TagSelector {tags} {updateTags} suggestions={allTags} />
		<div id='editor'></div>

		<button disabled={isCreating}>Submit</button>
	</form>

	{errMsg}
</section>
