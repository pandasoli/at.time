<script lang='ts'>
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'

  let isLoading = false
	export let form: {error?: string}

	const onSubmit: SubmitFunction = () => {
		isLoading = true

		return async ({ update }) => {
			await update()
			isLoading = false
		}
	}
</script>

<section>
	<form method='POST' use:enhance={onSubmit}>
		<input required placeholder='Username' name='username' type='text' />
		<input required placeholder='Password' name='password' type='password' />

		<button disabled={isLoading}>Log In</button>
	</form>

	{form?.error}
</section>
