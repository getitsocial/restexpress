import mongoose, { Schema } from 'mongoose'
import { paginatePlugin } from 's/mongoose'

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

		return full ? {...view } : view
	}
}

messageSchema.plugin(paginatePlugin)
const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
 