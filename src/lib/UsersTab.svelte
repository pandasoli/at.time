<script lang='ts'>
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { enhance } from '$app/forms'
	import type { Types } from 'mongoose'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { IUser } from '$lib/server/models/User.ts'
	import { UserPermissions } from '$utils/UserPermissions'
	import UserCard from '$lib/UserCard.svelte'

	let isLoading = false
	let openCreate = false
	let error: string
	let users: IUser[] = []

	let isCreating = false
	let didCreateFail = false
	let createMsg: string

	const load = () => {
		isLoading = true

		fetch('/api/users')
			.then(async res => {
				const obj = await res.json()

				if (res.ok) users = obj
				else error = obj.message

				isLoading = false
			})
			.catch(e => {
				error = e
				isLoading = false
			})
	}

	const onCreate: SubmitFunction = ({ formElement }) => {
		isCreating = true

		return ({ result }) => {
			isCreating = false
			didCreateFail = result.type !== 'success'

			if (didCreateFail)
				return createMsg = (result as any).data.error

			createMsg = ''
			formElement.reset()
			load()
		}
	}

	const remove = (id: Types.ObjectId) =>
		users = users.filter(e => e._id !== id)

	onMount(load)
</script>

{#if isLoading}
	<span>Loading...</span>
{:else if error}
	<span>{error}</span>
{:else}
	<button on:click={() => openCreate = !openCreate}>Create New</button>

	{#if openCreate}
		<form action='/dashboard?/create_user' method='POST' use:enhance={onCreate}>
			<input required placeholder='Username' name='username' type='text' />
			<input required placeholder='Password' name='password' type='password' />

			{#each UserPermissions as permission}
				{#if page.data.permissions.includes(permission)}
					<label>
						<input type='checkbox' name='permissions' value={permission} />
						{permission}
					</label>
				{/if}
			{/each}

			<button disabled={isCreating}>Create</button>
		</form>

		<span>{createMsg}</span>
	{/if}

	{#each users as user} <UserCard {user} {remove} /> {/each}
{/if}
