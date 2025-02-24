import { json, error } from '@sveltejs/kit'
import type { Cookies, RequestHandler } from '@sveltejs/kit'

import { connectDb } from '$lib/server/mongo.ts'
import User from '$lib/server/models/User.ts'
import Post from '$lib/server/models/Post.ts'


const authorization = async (cookies: Cookies) => {
	const auth_token = cookies.get('auth_token')

	// Connect to the database
	await connectDb()

	// Verify user permissions
	const user = await User.findOne({ _id: auth_token })

	return user && user.permissions.includes('posts')
}

export const GET: RequestHandler = async ({ cookies }) => {
	if (!await authorization(cookies))
		return error(403, 'Not authorized')

	// Retrive data
	const posts = await Post.find()

	return json(posts)
}
