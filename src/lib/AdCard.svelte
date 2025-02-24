<script lang='ts'>
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { Types } from 'mongoose'
	import type { IAd } from '$lib/server/models/Ad.ts'
	import { clickOutside } from '$lib/actions/clickOutside.ts'

	let errMsg: string|null = null
	let isLoading = false
	export let remove: (id: Types.ObjectId) => void
	export let ad: IAd

	let isUpdating = false
	let didUpdateFail = false
	let isEditing = false
	let hasChanges = false

	let editedImageUrl = ad.image_url
	let editedRedirectUrl = ad.redirect_url

	const checkForChanges = () =>
		hasChanges = editedImageUrl !== ad.image_url || editedRedirectUrl !== ad.redirect_url

	const onUpdate: SubmitFunction = ({ formData }) => {
		isUpdating = true

		formData.set('id', ad._id.toString())

		return ({ result }) => {
			isUpdating = false
			didUpdateFail = result.type !== 'success'

			if (didUpdateFail)
				return errMsg = (result as any).data.error

			errMsg = ''
			hasChanges = false
			isEditing = false
			ad.image_url = editedImageUrl
			ad.redirect_url = editedRedirectUrl
		}
	}

	const onDelete: SubmitFunction = () => {
		isLoading = true

		return ({ result }) => {
			isLoading = false

			if (result.type === 'success')
				remove(ad._id)
			else
				errMsg = (result as any).data.error
		}
	}
</script>

<div use:clickOutside on:clickoutside={() => isEditing = hasChanges}>
	{#if isEditing}
		<form action='/dashboard?/update_ad' method='POST' use:enhance={onUpdate}>
			<input required type='url' on:keyup={checkForChanges} placeholder='Image URL'    name='image_url'    bind:value={editedImageUrl} />
			<input required type='url' on:keyup={checkForChanges} placeholder='Redirect URL' name='redirect_url' bind:value={editedRedirectUrl} />

			{#if hasChanges}
				<button disabled={isUpdating}>Update</button>
			{/if}
		</form>
	{:else}
		<button on:click={() => isEditing = true}>
			<span>{ad.image_url}</span>
			<span>{ad.redirect_url}</span>
		</button>
	{/if}

	<form action='/dashboard?/delete_ad' method='POST' use:enhance={onDelete}>
		<input type='hidden' name='id' value={ad._id} />
		<button disabled={isLoading}>X</button>
	</form>

	{errMsg}
</div>
