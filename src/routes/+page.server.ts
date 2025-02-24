import type { PageServerLoad } from './$types'

import { connectDb } from '$lib/server/mongo.ts'
import Post from '$lib/server/models/Post.ts'
import Ad from '$lib/server/models/Ad.ts'


export const load: PageServerLoad = async () => {
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

	// Get all data
	const posts = await Post.aggregate(fmt)
	const ads = await Ad.aggregate(fmt)

	return { posts, ads }
}
