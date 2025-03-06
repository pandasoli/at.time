import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { connectDb } from '$lib/server/mongo.ts'
import Post from '$lib/server/models/Post.ts'


export const load: PageServerLoad = async ({ params, cookies }) => {
	// Connect to the database
	await connectDb()

	// Data format
	const fmt = [
		{
			$addFields: {
				createdAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } },
				updatedAt: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$updatedAt" } }
			}
		},
		{ $project: { _id: 0 } }
	]

	// Get post
	const post = (await Post.aggregate([
		{ $match: { slug: params.post } },
		...fmt
	]))[0]

	return { post }
}
