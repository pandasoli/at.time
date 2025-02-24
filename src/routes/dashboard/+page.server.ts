import { redirect, fail } from '@sveltejs/kit'
import type { Cookies } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import bcrypt from 'bcryptjs'

import { connectDb } from '$lib/server/mongo.ts'
import type { IUserPermission } from '$lib/server/models/User.ts'
import User from '$lib/server/models/User.ts'
import Post from '$lib/server/models/Post.ts'
import Ad from '$lib/server/models/Ad.ts'
import Paper from '$lib/server/models/Paper.ts'


export const load: PageServerLoad = async ({ cookies }) => {
	const authToken = cookies.get('auth_token')
	if (!authToken) throw redirect(303, '/login')

	// Connect to the database
	await connectDb()

	// Verify user permissions
	const user = await User.findOne({ _id: authToken })
	const permissions = user?.permissions ?? []

	return { permissions }
}

const authorization = async (cookies: Cookies, permission: IUserPermission) => {
	const auth_token = cookies.get('auth_token')

	// Connect to the database
	await connectDb()

	// Verify user permissions
	const user = await User.findOne({ _id: auth_token })

	return user && user.permissions.includes(permission)
}

export const actions: Actions = {
	create_user: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'users'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const username = data.get('username') as string
		const password = data.get('password') as string
		const permissions = data.getAll('password') as string[]

		// Validate information
		if (!username || !password)
			return fail(400, {error: 'Missing info'})

		// Create user
		try {
			const user = new User({
				name: username,
				password: bcrypt.hashSync(password),
				permissions
			})

			await user.save()
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not create user'})
		}
	},
	create_ad: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'ads'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const image_url = data.get('image_url')
		const redirect_url = data.get('redirect_url')

		// Validate information
		if (!image_url || !redirect_url)
			return fail(400, {error: 'Missing info'})

		// Create ad
		try {
			const ad = new Ad({ image_url, redirect_url })
			await ad.save()
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not create ad'})
		}
	},
	create_paper: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'papers'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const pdf_url = data.get('pdf_url') as string
		const preview_url = data.get('preview_url') as string
		const date = data.get('date') as string

		// Validate information
		if (!pdf_url || !preview_url || !date)
			return fail(400, {error: 'Missing info'})

		// Create paper
		try {
			const paper = new Paper({ pdf_url, preview_url, date })
			await paper.save()
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not create paper'})
		}
	},
	delete_post: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'posts'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')

		// Validate information
		if (!id)
			return fail(400, {error: 'Missing info'})

		// Delete post
		try {
			await Post.findByIdAndDelete(id)
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not delete post'})
		}
	},
	delete_user: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'users'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')

		// Validate information
		if (!id)
			return fail(400, {error: 'Missing info'})

		// Delete user
		try {
			await User.findByIdAndDelete(id)
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not delete user'})
		}
	},
	delete_ad: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'ads'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')

		// Validate information
		if (!id)
			return fail(400, {error: 'Missing info'})

		// Delete ad
		try {
			await Ad.findByIdAndDelete(id)
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not delete ad'})
		}
	},
	delete_paper: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'papers'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')

		// Validate information
		if (!id)
			return fail(400, {error: 'Missing info'})

		// Delete paper
		try {
			await Paper.findByIdAndDelete(id)
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not delete paper'})
		}
	},
	update_ad: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'ads'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')
		const image_url = data.get('image_url')
		const redirect_url = data.get('redirect_url')

		// Validate information
		if (!id || !image_url || !redirect_url)
			return fail(400, {error: 'Missing info'})

		// Update ad
		try {
			await Ad.findByIdAndUpdate(id, { image_url, redirect_url })
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not update ad'})
		}
	},
	update_paper: async ({ request, cookies }) => {
		// Check user authorization
		if (!await authorization(cookies, 'papers'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')
		const pdf_url = data.get('pdf_url')
		const preview_url = data.get('preview_url')
		const date = data.get('date')

		// Validate information
		if (!id || !pdf_url || !preview_url || !date)
			return fail(400, {error: 'Missing info'})

		// Update paper
		try {
			await Paper.findByIdAndUpdate(id, { pdf_url, preview_url, date })
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not update paper'})
		}
	},
	update_user: async ({ request, cookies }) => {
		// Connect to the database
		await connectDb()

		// Check user authorization
		const auth_token = cookies.get('auth_token')
		const user = await User.findOne({ _id: auth_token })

		if (!user || !user.permissions.includes('users'))
			return fail(403, {error: 'Not authorized'})

		// Get form data
		const data = await request.formData()
		const id = data.get('id')
		const username = data.get('username') as string
		const password = data.get('password') as string
		const permissions = data.getAll('permissions') as string[]

		// Validate information
		// password is not required
		if (!id || !username || !permissions)
			return fail(400, {error: 'Missing info'})

		if (permissions.some(e => !user.permissions.includes(e as any)))
			return fail(400, {error: 'Misaligned info'})

		// Update user
		try {
			await User.findByIdAndUpdate(id, {
				name: username,
				permissions,
				...(password && { password: bcrypt.hashSync(password) })
			})
		}
		catch (e) {
			console.log(e)
			return fail(409, {error: 'Could not update user'})
		}
	}
}
