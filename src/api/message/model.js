import mongoose, { Schema } from 'mongoose'
import { paginate } from 's/mongoose'

const messageSchema = new Schema(
	{
		content: {
			type: String,
			required: true
		},
		author: {
			type: 'ObjectId',
			ref: 'User',
			required: false
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

messageSchema.plugin(paginate)
const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
