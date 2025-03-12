import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

import { connectDb } from '$lib/server/mongo.ts'
import User from '$lib/server/models/User.ts'


export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const username = formData.get('username') as string
		const password = formData.get('password') as string

		// Basic validation
		if (!username || !password)
			return fail(400, { error: 'Username and password are required' })

		// Connect to the database
		await connectDb()

		// Check if the user exists
		const user = await User.findOne({ name: username })
		if (!user)
			return fail(401, { error: 'Invalid username or password' })

		// Verify the password
		const passMatch = await user.comparePassword(password)
		if (!passMatch)
			return fail(401, { error: 'Invalid username or password' })

		// If authentication is successful, set a cookie or session
		cookies.set('auth_token', user._id.toString(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 // 1 day
		})

		// Redirect to the home page or a protected route
		throw redirect(303, '/dashboard')
	}
}
