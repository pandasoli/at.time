<script lang='ts'>
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import type { Types } from 'mongoose'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { IPaper } from '$lib/server/models/Paper.ts'
	import PaperCard from '$lib/PaperCard.svelte'

	let isLoading = false
	let openCreate = false
	let error: string
	let papers: IPaper[] = []

	let isCreating = false
	let didCreateFail = false
	let createMsg: string

	const load = () => {
		isLoading = true

		fetch('/api/papers')
			.then(async res => {
				const obj = await res.json()

				if (res.ok) papers = obj
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
		papers = papers.filter(e => e._id !== id)

	onMount(load)
</script>

{#if isLoading}
	<span>Loading...</span>
{:else if error}
	<span>{error}</span>
{:else}
	<button on:click={() => openCreate = !openCreate}>Create New</button>

	{#if openCreate}
		<form action='/dashboard?/create_paper' method='POST' use:enhance={onCreate}>
			<input required type='url' placeholder='PDF URL' name='pdf_url' />
			<input required type='url' placeholder='Preview URL' name='preview_url' />
			<input required type='date' placeholder='Date' name='date' />

			<button disabled={isCreating}>Create</button>
		</form>

		<span>{createMsg}</span>
	{/if}

	{#each papers as paper} <PaperCard {paper} {remove} /> {/each}
{/if}
