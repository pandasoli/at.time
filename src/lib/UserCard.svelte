<script lang='ts'>
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { Types } from 'mongoose'
	import type { IUser, IUserPermission } from '$lib/server/models/User.ts'
	import { UserPermissions } from '$utils/UserPermissions'
	import { clickOutside } from '$lib/actions/clickOutside.ts'

	let errMsg: string|null = null
	let isLoading = false
	export let remove: (id: Types.ObjectId) => void
	export let user: IUser

	let isUpdating = false
	let didUpdateFail = false
	let isEditing = false
	let hasChanges = false

	let editedUsername = user.name
	let editedPassword = ''
	let editedPermissions = new Set(user.permissions)

	const checkForChanges = () =>
		hasChanges = editedUsername !== user.name || editedPassword !== '' || Array.from(editedPermissions).join() !== user.permissions.join()

	const togglePermission = (permission: IUserPermission) => {
		if (editedPermissions.has(permission))
			editedPermissions.delete(permission)
		else
			editedPermissions.add(permission)

		checkForChanges()
	}

	const onUpdate: SubmitFunction = ({ formData }) => {
		isUpdating = true

		formData.set('id', user._id.toString())

		return ({ result }) => {
			isUpdating = false
			didUpdateFail = result.type !== 'success'

			if (didUpdateFail)
				return errMsg = (result as any).data.error

			errMsg = ''
			hasChanges = false
			isEditing = false
			user.name = editedUsername
			user.permissions = Array.from(editedPermissions)
		}
	}

	const onDelete: SubmitFunction = () => {
		isLoading = true

		return ({ result }) => {
			isLoading = false

			if (result.type === 'success')
				remove(user._id)
			else
				errMsg = (result as any).data.error
		}
	}
</script>

<div use:clickOutside on:clickoutside={() => isEditing = hasChanges}>
	{#if isEditing}
		<form action='/dashboard?/update_user' method='POST' use:enhance={onUpdate}>
			<input required on:keyup={checkForChanges} placeholder='Username' name='username' bind:value={editedUsername} type='text' />
			<input          on:keyup={checkForChanges} placeholder='Password' name='password' bind:value={editedPassword} type='password' />

			{#each UserPermissions as permission}
				{#if page.data.permissions.includes(permission)}
					<label>
						<input
							type='checkbox' name='permissions' value={permission}
							checked={editedPermissions.has(permission)}
							on:change={() => togglePermission(permission)}
						/>
						{permission}
					</label>
				{/if}
			{/each}

			{#if hasChanges}
				<button disabled={isUpdating}>Update</button>
			{/if}
		</form>
	{:else}
		<button on:click={() => isEditing = true}>
			<span>{user.name}</span>
		</button>
	{/if}

	<form action='/dashboard?/delete_ad' method='POST' use:enhance={onDelete}>
		<input type='hidden' name='id' value={user._id} />
		<button disabled={isLoading}>X</button>
	</form>

	{errMsg}
</div>
