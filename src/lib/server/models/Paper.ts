import mongoose, { Schema, Document, Types } from 'mongoose'


export interface IPaper extends Document {
	_id: Types.ObjectId
	pdf_url: string
	preview_url: string

	date: string

	createdAt: Date
	updatedAt: Date
}

const PaperSchema: Schema = new Schema({
	pdf_url:     { type: String, required: true },
	preview_url: { type: String, required: true },
	date:        { type: Date,   required: true }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
})

PaperSchema.path('date').get((date: Date) => date.toISOString().split('T')[0])

const Paper = mongoose.model<IPaper>('Paper', PaperSchema)
export default Paper
