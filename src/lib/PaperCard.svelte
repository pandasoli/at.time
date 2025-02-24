<script lang='ts'>
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { Types } from 'mongoose'
	import type { IPaper } from '$lib/server/models/Paper.ts'
	import { clickOutside } from '$lib/actions/clickOutside.ts'

	let errMsg: string|null = null
	let isLoading = false
	export let remove: (id: Types.ObjectId) => void
	export let paper: IPaper

	let isUpdating = false
	let didUpdateFail = false
	let isEditing = false
	let hasChanges = false

	let editedPDFUrl = paper.pdf_url
	let editedPreviewUrl = paper.preview_url
	let editedDate = paper.date

	const checkForChanges = () =>
		hasChanges =
			editedPDFUrl !== paper.pdf_url ||
			editedPreviewUrl !== paper.preview_url ||
			editedDate !== paper.date

	const onUpdate: SubmitFunction = ({ formData }) => {
		isUpdating = true

		formData.set('id', paper._id.toString())

		return ({ result }) => {
			isUpdating = false
			didUpdateFail = result.type !== 'success'

			if (didUpdateFail)
				return errMsg = (result as any).data.error

			errMsg = ''
			hasChanges = false
			isEditing = false
			paper.pdf_url = editedPDFUrl
			paper.preview_url = editedPreviewUrl
			paper.date = editedDate
		}
	}

	const onDelete: SubmitFunction = () => {
		isLoading = true

		return ({ result }) => {
			isLoading = false

			if (result.type === 'success')
				remove(paper._id)
			else
				errMsg = (result as any).data.error
		}
	}
</script>

<div use:clickOutside on:clickoutside={() => isEditing = hasChanges}>
	{#if isEditing}
		<form action='/dashboard?/update_paper' method='POST' use:enhance={onUpdate}>
			<input required type='url' on:keyup={checkForChanges} placeholder='PDF URL' name='pdf_url' bind:value={editedPDFUrl} />
			<input required type='url' on:keyup={checkForChanges} placeholder='Preview URL' name='preview_url' bind:value={editedPreviewUrl} />
			<input required type='date' on:keyup={checkForChanges} placeholder='Date' name='date' bind:value={editedDate} />

			{#if hasChanges}
				<button disabled={isUpdating}>Update</button>
			{/if}
		</form>
	{:else}
		<button on:click={() => isEditing = true}>
			<img src={paper.preview_url} alt='PDF preview' />
			<span>{paper.date}</span>
		</button>
	{/if}

	<form action='/dashboard?/delete_paper' method='POST' use:enhance={onDelete}>
		<input type='hidden' name='id' value={paper._id} />
		<button disabled={isLoading}>X</button>
	</form>

	{errMsg}
</div>
