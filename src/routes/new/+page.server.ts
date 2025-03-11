import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

import { connectDb } from '$lib/server/mongo.ts'
import User from '$lib/server/models/User.ts'
import Post from '$lib/server/models/Post.ts'


export const load: PageServerLoad = async ({ url, cookies }) => {
	const authToken = cookies.get('auth_token')
	if (!authToken) throw redirect(303, '/login')

	// Connect to the database
	await connectDb()

	// Verify user permissions
	const user = await User.findOne({ _id: authToken })

	if (!user || !user.permissions.includes('posts'))
		throw redirect(303, '/login')

	// Get all tags
	const posts = await Post.find({}, 'tags')
	const allTags = [...new Set(posts.flatMap(post => post.tags))]

	// Get editing post
	const fmt = [
		{
			$addFields: {
				createdAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } },
				updatedAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$updatedAt" } }
			}
		},
		{ $project: { _id: 0 } },
		{ $limit: 1 }
	]

	const editingSlug = url.searchParams.get('edit')
	const editingPost = editingSlug
		? (await Post.aggregate([
				{ $match: { slug: editingSlug } },
				...fmt
			]))[0]
		:	null

	return { allTags, editingPost }
}

export const actions: Actions = {
	create: async ({ request, cookies }) => {
		// Verify user permissions
		const user = await User.findOne({ _id: cookies.get('auth_token') })

		if (!user || !user.permissions.includes('posts'))
			return fail(403, { error: 'Not authorized' })

		// Get form data
		const data = await request.formData()
		const title = data.get('title') as string
		const description = data.get('description') as string
		const author = data.get('author') as string
		const tags = data.getAll('tags') as string[]
		const contents = data.get('contents') as string

		// Validate the input
		if (!title || !description || !author || !tags || !contents)
			return fail(400, { error: 'Missing info' })

		// Connect to the database
		await connectDb()

		// Create a new post
		try {
			const post = new Post({
				title,
				description,
				author,
				views: 0,
				tags,
				contents: contents.replace(/&nbsp;/g, ' ')
			})

			// Save the post to the database
			await post.save()
		}
		catch (err: any) {
			if (err.code === 11000 && err.keyPattern?.slug)
				return fail(500, { error: 'A post with this slug already exists' })
			return fail(500, { error: 'Failed to create post' })
		}
	},
	update: async ({ request, cookies }) => {
		// Verify user permissions
		const user = await User.findOne({ _id: cookies.get('auth_token') })

		if (!user || !user.permissions.includes('posts'))
			return fail(403, { error: 'Not authorized' })

		// Get form data
		const data = await request.formData()
		const title = data.get('title') as string
		const slug = data.get('slug') as string
		const description = data.get('description') as string
		const author = data.get('author') as string
		const tags = data.getAll('tags') as string[]
		const contents = data.get('contents') as string

		// Validate the input
		if (!title || !slug || !description || !author || !tags || !contents)
			return fail(400, { error: 'Missing info' })

		// Connect to the database
		await connectDb()

		// Edit post
		let newslug: string

		try {
			const newpost = await Post.findOneAndUpdate({ slug }, {
				title,
				description,
				author,
				tags,
				contents: contents.replace(/&nbsp;/g, ' ')
			})

			newslug = newpost!.slug
		}
		catch (err) {
			console.error('Error editing post:', err, '\\0')
			return fail(500, { error: 'Failed to edit post' })
		}

		throw redirect(303, `/${newslug}`)
	}
}
