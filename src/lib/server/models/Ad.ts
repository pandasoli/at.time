import mongoose, { Schema, Document, Types } from 'mongoose'


export interface IAd extends Document {
	_id: Types.ObjectId
	image_url: string
	redirect_url: string

  createdAt: Date
  updatedAt: Date
}

const AdSchema: Schema = new Schema({
  image_url:    { type: String, required: true },
	redirect_url: { type: String, required: true }
}, { timestamps: true })

const Ad = mongoose.model<IAd>('Ad', AdSchema)
export default Ad
