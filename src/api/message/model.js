import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
	{
		content: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (obj, ret) => {
				delete ret._id
			}
		}
	}
)

messageSchema.methods = {
	view(full) {
		const view = {
			// simple view
			id: this.id,
			content: this.content,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}

		return full
			? {
				...view
				// add properties for a full view
			  }
			: view
	}
}

const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
