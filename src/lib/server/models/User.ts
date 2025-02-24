import mongoose, { Schema, Document, Types } from 'mongoose'
import bcrypt from 'bcryptjs'

import { UserPermissions } from '$utils/UserPermissions.ts'


export type IUserPermission = (typeof UserPermissions)[number]

export interface IUser extends Document {
	_id: Types.ObjectId
	name: string
	password: string
	permissions: IUserPermission[]

	createdAt: Date
	updatedAt: Date

	comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	permissions: {
		type: [String],
		enum: UserPermissions,
		validate: {
			validator: (tags: string[]) =>
				tags.every(tag => UserPermissions.includes(tag as any)),
			message: (props: {value: string}) => `${props.value} is not valid.`
		}
	}
}, { timestamps: true })

// Hash the password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) return next()

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
	return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model<IUser>('User', UserSchema)
export default User
