<script lang='ts'>
	import { page } from '$app/state'
	import type { IUserPermission } from '$lib/server/models/User.ts'
	import { UserPermissions } from '$utils/UserPermissions.ts'
	import UsersTab from '$lib/UsersTab.svelte'
	import PostsTab from '$lib/PostsTab.svelte'
	import AdsTab from '$lib/AdsTab.svelte'
	import PapersTab from '$lib/PapersTab.svelte'

	const permissions = new Set(page.data.permissions)

	let tab: IUserPermission|null = null
</script>

<section>
	<ul>
		{#each UserPermissions as permission}
			{#if permissions.has(permission)}
				<li><button on:click={() => tab = permission}>{permission}</button></li>
			{/if}
		{/each}
	</ul>

	{#if tab === 'users'} <UsersTab /> {/if}
	{#if tab === 'posts'} <PostsTab /> {/if}
	{#if tab === 'ads'} <AdsTab /> {/if}
	{#if tab === 'papers'} <PapersTab /> {/if}
</section>
