import mongoose, { Schema, Document, Types } from 'mongoose'
import slugify from 'slugify'


export interface IPost extends Document {
	_id: Types.ObjectId
  title: string
	description: string
	author: string
	slug: string

	views: number
	tags: string[]

	contents: string

  createdAt: Date
  updatedAt: Date
}

const PostSchema: Schema = new Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
	author:   { type: String, required: true },
	slug:     { type: String, unique: true, trim: true }, // Not required as it'll be generated in the pre-save
	views:    { type: Number, required: true },
	tags:     { type: [String], required: true },
	contents: { type: String, required: true }
}, { timestamps: true })

// Generate a slug before saving the document
PostSchema.pre<IPost>('save', function(next) {
  if (this.isModified('title'))
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    })

  next()
})

const Post = mongoose.model<IPost>('Post', PostSchema)
export default Post
