<script lang='ts'>
	let input = ''
	let filteredSuggestions: string[] = []
	export let tags: string[] = []
	export let suggestions: string[] = []
	export let updateTags: (tags: string[]) => void


	const filterSuggestions = () =>
		filteredSuggestions = suggestions.filter(tag =>
			tag.toLowerCase().includes(input.toLowerCase()) &&
			!tags.includes(tag)
		)

	const add = (tag: string) => {
		if (!tags.includes(tag)) {
			tags = [...tags, tag]
			input = ''
			filterSuggestions()
			updateTags(tags)
		}
	}

	const remove = (tag: string) => {
		tags = tags.filter(t => t !== tag)
		filterSuggestions()
		updateTags(tags)
	}

	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		input = target.value
		filterSuggestions()
	}

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && input.trim()) {
			event.preventDefault()
			add(input.trim())
		}
	}

	$: filterSuggestions()
</script>

<div>
	<!-- Selected Tags -->
	<div>
		{#each tags as tag}
			<div>
				{tag}
				<button on:click={() => remove(tag)}>x</button>
			</div>
		{/each}
	</div>

	<!-- Input Field -->
	<input
		type='text'
		bind:value={input}
		on:input={onInput}
		on:keydown={onKeydown}
		placeholder='Add a tag...'
	/>

	<!-- Suggestions Dropdown -->
	{#if input && filteredSuggestions.length > 0}
		<div>
			{#each filteredSuggestions as tag}
				<button on:click={() => add(tag)}>{tag}</button>
			{/each}
		</div>
	{/if}
</div>
