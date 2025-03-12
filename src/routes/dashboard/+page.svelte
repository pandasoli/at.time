<script lang='ts'>
	import type { IUserPermission } from '$lib/server/models/User.ts'
	import { UserPermissions } from '$utils/UserPermissions.ts'
	import UsersTab from '$lib/UsersTab.svelte'
	import PostsTab from '$lib/PostsTab.svelte'
	import AdsTab from '$lib/AdsTab.svelte'
	import PapersTab from '$lib/PapersTab.svelte'

	export let data: {permissions: IUserPermission[]}
	const { permissions } = data

	let tab: IUserPermission|null = null
</script>

<section>
	<ul>
		{#each UserPermissions as permission}
			{#if permissions.includes(permission)}
				<li><button on:click={() => tab = permission}>{permission}</button></li>
			{/if}
		{/each}
	</ul>

	{tab}

	{#if tab === 'users'} <UsersTab />
	{:else if tab === 'posts'} <PostsTab />
	{:else if tab === 'ads'} <AdsTab />
	{:else if tab === 'papers'} <PapersTab />
	{:else} <p>Nothing selected</p>
	{/if}
</section>
