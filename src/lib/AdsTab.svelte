<script lang='ts'>
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import type { Types } from 'mongoose'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { IAd } from '$lib/server/models/Ad.ts'
	import AdCard from '$lib/AdCard.svelte'

	let isLoading = false
	let openCreate = false
	let error: string
	let ads: IAd[] = []

	let isCreating = false
	let didCreateFail = false
	let createMsg: string

	const load = () => {
		isLoading = true

		fetch('/api/ads')
			.then(async res => {
				const obj = await res.json()

				if (res.ok) ads = obj
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
		ads = ads.filter(e => e._id !== id)

	onMount(load)
</script>

{#if isLoading}
	<span>Loading...</span>
{:else if error}
	<span>{error}</span>
{:else}
	<button on:click={() => openCreate = !openCreate}>Create New</button>

	{#if openCreate}
		<form action='/dashboard?/create_ad' method='POST' use:enhance={onCreate}>
			<input required type='url' placeholder='Image URL'    name='image_url' />
			<input required type='url' placeholder='Redirect URL' name='redirect_url' />

			<button disabled={isCreating}>Create</button>
		</form>

		<span>{createMsg}</span>
	{/if}

	{#each ads as ad} <AdCard {ad} {remove} /> {/each}
{/if}
